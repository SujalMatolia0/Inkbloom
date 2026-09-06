'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export async function submitCommission(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const instructions = formData.get('instructions') as string;
  const referenceUrl = formData.get('referenceImg') as string | null;
  const referenceFile = formData.get('file') as File | null;

  // Validate required fields
  if (!name || !email || !instructions) {
    return { success: false, error: 'All fields are required.' };
  }

  // Basic email validation
  if (!email.includes('@') || !email.includes('.')) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  let referenceImg = referenceUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119';

  // If a file or base64 was sent, upload to Cloudinary
  try {
    if (referenceFile && typeof referenceFile === 'object' && 'arrayBuffer' in referenceFile && referenceFile.size > 0) {
      const bytes = await referenceFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const cloudRes = await uploadImageToCloudinary(buffer, 'inkbloom/commissions');
      referenceImg = cloudRes.url;
    } else if (referenceUrl && referenceUrl.startsWith('data:image')) {
      const cloudRes = await uploadImageToCloudinary(referenceUrl, 'inkbloom/commissions');
      referenceImg = cloudRes.url;
    }
  } catch (uploadErr) {
    console.warn('Cloudinary upload warning during commission submission:', uploadErr);
  } 

  try {
    // Try to get the authenticated user first
    const session = await getServerSession(authOptions);
    let userId: string;

    if (session?.user?.id) {
      // Authenticated user — use their ID
      userId = session.user.id;
    } else {
      // Guest submission — find or create user by submitted email
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
          },
        });
      }

      userId = user.id;
    }

    await prisma.commission.create({
      data: {
        userId,
        instructions,
        referenceImg,
        status: 'PENDING',
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Commission submission failed:', error);
    return { success: false, error: 'Failed to submit commission.' };
  }
}
