'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function submitCommission(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const instructions = formData.get('instructions') as string;

  // Validate required fields
  if (!name || !email || !instructions) {
    return { success: false, error: 'All fields are required.' };
  }

  // Basic email validation
  if (!email.includes('@') || !email.includes('.')) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  // referenceImg would handle file upload — placeholder for now
  const referenceImg = 'https://placeholder.com/reference.jpg'; 

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
