import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || 'Vinyas/uploads';

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 },
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadImageToCloudinary(buffer, folder);
      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      });
    }

    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { image, folder = 'Vinyas/uploads' } = body;

      if (!image) {
        return NextResponse.json(
          { error: 'No image payload provided' },
          { status: 400 },
        );
      }

      const result = await uploadImageToCloudinary(image, folder);
      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      });
    }

    return NextResponse.json(
      {
        error:
          'Unsupported Content-Type. Expected multipart/form-data or application/json',
      },
      { status: 400 },
    );
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Cloudinary upload failed' },
      { status: 500 },
    );
  }
}
