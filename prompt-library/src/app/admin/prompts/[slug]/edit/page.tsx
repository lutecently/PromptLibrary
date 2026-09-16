import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPromptBySlug } from '@/lib/promptUtils';
import { getAllCategories } from '@/lib/prompts';
import EditPromptForm from '@/components/admin/EditPromptForm';

interface EditPromptPageProps {
  params: { slug: string };
}

export const metadata: Metadata = {
  title: 'Edit Prompt - Prompt Library',
};

export default function EditPromptPage({ params }: EditPromptPageProps) {
  const prompt = getPromptBySlug(params.slug);
  const categories = getAllCategories();

  if (!prompt) {
    notFound();
  }

  return <EditPromptForm prompt={prompt} categories={categories} />;
}
