import { NextRequest, NextResponse } from 'next/server';
import { createPrompt } from '@/lib/promptUtils';
import { regenerateStaticData } from '@/lib/regenerateStaticData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.title || !body.description || !body.category || !body.content) {
      return NextResponse.json({ error: 'Missing required prompt information' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const customSlug = body.customFileName || undefined;

    const newPrompt = createPrompt(
      {
        title: body.title,
        description: body.description,
        category: body.category,
        content: body.content,
        image: body.image || '',
        author: body.author || '',
        tags: Array.isArray(body.tags) ? body.tags : [],
        createdAt: now,
        updatedAt: now,
        featured: Boolean(body.featured),
        rating: typeof body.rating === 'number' ? body.rating : 8.0,
      },
      customSlug
    );

    if (!newPrompt) {
      return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
    }

    regenerateStaticData();

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    console.error('API error creating prompt:', error);
    return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
  }
}
