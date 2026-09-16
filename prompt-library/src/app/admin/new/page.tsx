import { Metadata } from 'next';
import { getAllCategories } from '@/lib/prompts';
import NewPromptForm from '@/components/admin/NewPromptForm';

export const metadata: Metadata = {
  title: 'New Prompt - Prompt Library',
};

export default function NewPromptPage() {
  const categories = getAllCategories();

  return <NewPromptForm categories={categories} />;
}
