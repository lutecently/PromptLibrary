import { getAllPrompts } from '@/lib/prompts';
import { PromptData } from '@/types';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the client component
const PopularPromptsContent = dynamic(() => import('@/components/PopularPromptsContent'), {
    ssr: false,
    loading: () => (
        <div className="container mx-auto px-4 py-8">
            <div className="page-header">
                <h1 className="page-title skeleton"></h1>
                <p className="page-description skeleton"></p>
            </div>

            <div className="filter-bar skeleton-loading">
                <div className="skeleton"></div>
            </div>

            <div className="prompt-grid skeleton-loading">
                {[...Array(9)].map((_, index) => (
                    <div key={index} className="prompt-card skeleton"></div>
                ))}
            </div>
        </div>
    )
});

export const metadata: Metadata = {
    title: 'Popular Prompts - Prompt Library',
    description: 'Discover the AI prompts the community loves most, sorted by popularity'
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

export default function PopularPromptsPage() {
    // Fetch all prompts (with error handling)
    let allPrompts: PromptData[] = [];
    try {
        allPrompts = getAllPrompts();
        // Use the fallback data if no prompts were found
        if (allPrompts.length === 0) {
            allPrompts = fallbackPrompts;
        }
    } catch (error) {
        console.error('Error fetching prompt data:', error);
        // Error handling - use the fallback data
        allPrompts = fallbackPrompts;
    }

    return <PopularPromptsContent prompts={allPrompts} />;
} 