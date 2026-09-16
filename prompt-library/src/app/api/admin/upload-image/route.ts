import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile, fetchAndSaveImage } from '@/lib/imageStorage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const url = formData.get('url');

    if (file instanceof File && file.size > 0) {
      const savedPath = await saveUploadedFile(file);
      return NextResponse.json({ url: savedPath });
    }

    if (typeof url === 'string' && url.trim()) {
      const savedPath = await fetchAndSaveImage(url.trim());
      return NextResponse.json({ url: savedPath });
    }

    return NextResponse.json({ error: 'Provide either a file or a URL' }, { status: 400 });
  } catch (error) {
    console.error('API error uploading image:', error);
    const message = error instanceof Error ? error.message : 'Failed to save image';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
