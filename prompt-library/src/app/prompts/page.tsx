import { Metadata } from 'next';
import { getAllPrompts } from '@/lib/prompts';
import dynamic from 'next/dynamic';
import { PromptData } from '@/types';

// 动态导入客户端组件，避免服务器端渲染错误
const PaginatedPrompts = dynamic(() => import('@/components/PaginatedPrompts'), { ssr: false });

export const metadata: Metadata = {
  title: 'All Prompts - Prompt Library',
  description: 'Browse our full collection of AI prompts and find the perfect one for your needs',
};

// Fallback sample data, used when the file system can't be read at build time
const fallbackPrompts: PromptData[] = [
  {
    slug: 'professional-article-generator',
    title: 'Professional Article Generator',
    description: 'Create structured, professional articles with engaging headlines, precise subheadings, and rich content.',
    category: 'Content Creation',
    rating: 9.8,
    createdAt: '2023-01-15',
    featured: true
  },
  {
    slug: 'code-optimization-assistant',
    title: 'Code Optimization Assistant',
    description: 'Analyze and optimize your code, with performance improvement suggestions and best-practice guidance.',
    category: 'Programming',
    rating: 9.5,
    createdAt: '2023-01-20',
    featured: true
  }
];

export default function PromptsPage() {
  // Fetch all prompts as the initial data (with error handling)
  // Note: at static build time, this data is used to generate the static HTML
  // On the client, the PaginatedPrompts component loads the corresponding page's JSON data
  let initialPrompts: PromptData[] = [];
  try {
    initialPrompts = getAllPrompts();
    // Use the fallback data if no prompts were found
    if (initialPrompts.length === 0) {
      initialPrompts = fallbackPrompts;
    }
  } catch (error) {
    console.error('Error fetching prompt data:', error);
    // Error handling - use the fallback data
    initialPrompts = fallbackPrompts;
  }

  // Only pass the first page of data as the initial data
  const initialPageData = initialPrompts.slice(0, 9);
  const totalPages = Math.ceil(initialPrompts.length / 9);

  return (
    <main>
      <section className="page-header">
        <h1>All Prompts</h1>
        <p>Browse our full collection of AI prompts and find the perfect one for your needs</p>
      </section>

      <section className="prompts-list">
        <PaginatedPrompts
          type="all"
          initialData={initialPageData}
          initialMeta={{
            total: initialPrompts.length,
            perPage: 9,
            totalPages: totalPages
          }}
        />
      </section>
    </main>
  );
}