import { NextRequest, NextResponse } from 'next/server';
import { getPromptBySlug, updatePrompt, deletePrompt } from '@/lib/promptUtils';
import { regenerateStaticData } from '@/lib/regenerateStaticData';
import { deleteStoredImage } from '@/lib/imageStorage';

interface RouteParams {
  params: { slug: string };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { slug } = params;

  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json({ error: 'Missing update data' }, { status: 400 });
    }

    const existingPrompt = getPromptBySlug(slug);
    if (!existingPrompt) {
      return NextResponse.json({ error: `No prompt found with slug ${slug}` }, { status: 404 });
    }

    const success = updatePrompt(slug, {
      title: body.title,
      description: body.description,
      category: body.category,
      content: body.content,
      image: body.image,
      featured: body.featured,
      rating: body.rating,
    });

    if (!success) {
      return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 });
    }

    // Clean up the old uploaded image if it was replaced
    if (body.image !== existingPrompt.image) {
      deleteStoredImage(existingPrompt.image);
    }

    regenerateStaticData();

    const updatedPrompt = getPromptBySlug(slug);
    return NextResponse.json({ message: 'Prompt updated successfully', prompt: updatedPrompt });
  } catch (error) {
    console.error(`API error updating prompt ${slug}:`, error);
    return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = params;

  try {
    const existingPrompt = getPromptBySlug(slug);
    if (!existingPrompt) {
      return NextResponse.json({ error: `No prompt found with slug ${slug}` }, { status: 404 });
    }

    const success = deletePrompt(slug);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 });
    }

    deleteStoredImage(existingPrompt.image);

    regenerateStaticData();

    return NextResponse.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error(`API error deleting prompt ${slug}:`, error);
    return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 });
  }
}
