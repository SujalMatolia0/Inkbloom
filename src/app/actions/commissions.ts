'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { 
  uploadPrivateImageToCloudinary, 
  getPrivateImageUrl, 
  deleteCloudinaryImage 
} from '@/lib/cloudinary';
import { sendCommissionNotification } from '@/lib/email';
import { SITE_CONFIG } from '@/lib/site';

/**
 * Validates image buffer magic bytes for JPEG, PNG, or WebP.
 */
function isValidImageMagicBytes(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  return false;
}

export async function submitCommission(formData: FormData) {
  // 1. Extract discrete form fields
  const name = (formData.get('name') as string || '').trim();
  const rawEmail = (formData.get('email') as string || '').trim();
  const email = rawEmail.toLowerCase();
  const phone = (formData.get('phone') as string || '').trim();
  const service = (formData.get('service') as string || 'custom-canvas').trim();
  const size = (formData.get('size') as string || 'Medium').trim();
  const budgetINR = parseInt(formData.get('budgetValue') as string || '5000', 10);
  const vision = (formData.get('vision') as string || '').trim();
  const additionalNotes = (formData.get('additionalNotes') as string || '').trim();
  const honeypot = (formData.get('honeypot') as string || '').trim();
  const consentGiven = formData.get('consentGiven') === 'true' || formData.get('consentGiven') === 'on';

  // Service-specific extra fields
  const eventDate = (formData.get('eventDate') as string || '').trim();
  const flowerType = (formData.get('flowerType') as string || '').trim();
  const wallDimensions = (formData.get('wallDimensions') as string || '').trim();
  const cityLocation = (formData.get('cityLocation') as string || '').trim();

  const referenceFile = formData.get('file') as File | null;

  // 2. Server-side Spam Trap Check
  if (honeypot.length > 0) {
    return { success: true }; // Silent rejection for bots
  }

  // 3. Server-side Field & Consent Validation
  if (!name || !email || !phone || !vision) {
    return { success: false, error: 'Name, email, phone, and project description are required.' };
  }

  if (!consentGiven) {
    return { success: false, error: 'You must agree to the Privacy Policy and Terms of Service.' };
  }

  if (name.length > 100) {
    return { success: false, error: 'Name must be under 100 characters.' };
  }

  if (vision.length > 5000) {
    return { success: false, error: 'Description must be under 5,000 characters.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // 4. Rate Limiting Check (Max 3 submissions per email/phone per 15 mins)
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
  const recentSubmissions = await prisma.commission.count({
    where: {
      OR: [
        { contactEmail: email },
        { phone },
      ],
      createdAt: { gte: fifteenMinsAgo },
    },
  });

  if (recentSubmissions >= 3) {
    return {
      success: false,
      error: 'Too many submissions from this email or phone. Please wait 15 minutes before sending another inquiry.',
    };
  }

  // 5. Private Reference Image Upload & Magic Byte Check
  let referencePublicId: string | null = null;

  if (
    referenceFile &&
    typeof referenceFile === 'object' &&
    'arrayBuffer' in referenceFile &&
    referenceFile.size > 0
  ) {
    // Size check (10MB)
    if (referenceFile.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Reference image must be smaller than 10MB.' };
    }

    const bytes = await referenceFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes
    if (!isValidImageMagicBytes(buffer)) {
      return {
        success: false,
        error: 'Invalid file format. Only JPEG, PNG, and WebP images are accepted.',
      };
    }

    try {
      const cloudRes = await uploadPrivateImageToCloudinary(
        buffer,
        'Vinyas/commissions_private',
      );
      referencePublicId = cloudRes.public_id;
    } catch (uploadErr) {
      console.error('Cloudinary private upload error:', uploadErr);
      return {
        success: false,
        error: `Failed to upload private reference image. Please try a smaller file or email us at ${SITE_CONFIG.email}.`,
      };
    }
  }

  // Assemble server-side instructions text
  const compiledInstructions = `
Service Category: ${service}
Size / Scope: ${size}
Budget: ₹${budgetINR.toLocaleString('en-IN')}
Phone: ${phone}
${eventDate ? `Event Date: ${eventDate}\n` : ''}${flowerType ? `Flower Details: ${flowerType}\n` : ''}${wallDimensions ? `Wall Dimensions: ${wallDimensions}\n` : ''}${cityLocation ? `City Location: ${cityLocation}\n` : ''}
Vision & Concept:
${vision}
${additionalNotes ? `\nAdditional Notes:\n${additionalNotes}` : ''}
  `.trim();

  // 6. DB Creation & Cleanup on Failure
  try {
    const session = await getServerSession(authOptions);
    let userId: string | null = null;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    const commission = await prisma.commission.create({
      data: {
        userId,
        contactName: name,
        contactEmail: email,
        phone,
        service,
        size,
        budgetINR,
        details: {
          eventDate,
          flowerType,
          wallDimensions,
          cityLocation,
          additionalNotes,
        },
        instructions: compiledInstructions,
        referencePublicId,
        consentAt: new Date(),
        consentVersion: 'v1.0-oct2026',
        status: 'PENDING',
      },
    });

    // 7. Send Notifications (Signed private URL for admin view)
    let signedAdminUrl: string | null = null;
    if (referencePublicId) {
      signedAdminUrl = getPrivateImageUrl(referencePublicId);
    }

    try {
      await sendCommissionNotification({
        customerName: name,
        customerEmail: email,
        instructions: compiledInstructions,
        referenceImg: signedAdminUrl,
      });

      await prisma.commission.update({
        where: { id: commission.id },
        data: { notifiedAt: new Date() },
      });
    } catch (emailErr) {
      console.error('Email alert notification error:', emailErr);
    }

    revalidatePath('/admin/commissions');
    return { success: true, commissionId: commission.id };
  } catch (error) {
    console.error('Commission DB submission failed:', error);
    // Cleanup orphaned private Cloudinary upload if DB write failed
    if (referencePublicId) {
      await deleteCloudinaryImage(referencePublicId, 'authenticated');
    }
    return { success: false, error: 'Failed to save commission inquiry. Please try again.' };
  }
}
