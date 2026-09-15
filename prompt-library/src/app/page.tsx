import { Metadata } from 'next';
import {
  getFeaturedPrompts,
  getRecentPrompts,
  getAllCategories
} from '@/lib/prompts';
import { PromptData } from '@/types';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const HomeContent = dynamic(() => import('@/components/HomeContent'), {
  ssr: false,
  loading: () => (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1 className="skeleton"></h1>
          <p className="skeleton"></p>
          <div className="search-container skeleton"></div>
        </div>
      </section>

      <section className="featured">
        <div className="section-header">
          <h2 className="skeleton"></h2>
          <div className="view-all skeleton"></div>
        </div>
        <div className="prompt-grid skeleton-loading">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="prompt-card skeleton"></div>
          ))}
        </div>
      </section>

      <section className="categories">
        <div className="section-header">
          <h2 className="skeleton"></h2>
        </div>
        <div className="category-container skeleton-loading">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="category-item skeleton"></div>
          ))}
        </div>
      </section>
    </main>
  )
});

export const metadata: Metadata = {
  title: 'Prompt Library - AI Prompt Collection',
  description: 'Discover and use a curated collection of high-quality AI prompts to boost your productivity with AI',
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

// Static generation flag
export const revalidate = 3600; // Regenerate the page once per hour

export default function Home() {
  // Fetch data (with error handling)
  let featuredPrompts: PromptData[] = [];
  let recentPrompts: PromptData[] = [];

  try {
    featuredPrompts = getFeaturedPrompts();
    if (featuredPrompts.length === 0) {
      featuredPrompts = fallbackPrompts;
    }
  } catch (error) {
    console.error('Error fetching featured prompts:', error);
    featuredPrompts = fallbackPrompts;
  }

  try {
    recentPrompts = getRecentPrompts();
    if (recentPrompts.length === 0) {
      recentPrompts = fallbackPrompts;
    }
  } catch (error) {
    console.error('Error fetching recent prompts:', error);
    recentPrompts = fallbackPrompts;
  }

  const categories = getAllCategories();

  return <HomeContent
    featuredPrompts={featuredPrompts}
    recentPrompts={recentPrompts}
    categories={categories}
  />;
}