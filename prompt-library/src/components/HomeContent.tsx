"use client";

import Link from 'next/link';
import PromptCard from '@/components/PromptCard';
import CategoryItem from '@/components/CategoryItem';
import Hero from '@/components/Hero';
import { PromptData, CategoryData } from '@/types';
import { useTranslation } from '../lib/i18n';

interface HomeContentProps {
    featuredPrompts: PromptData[];
    recentPrompts: PromptData[];
    categories: CategoryData[];
}

export default function HomeContent({ featuredPrompts, recentPrompts, categories }: HomeContentProps) {
    const { t } = useTranslation();

    return (
        <main>
            <Hero />

            {/* Featured prompts */}
            <section className="featured">
                <div className="section-header">
                    <h2>{t('homepage.featured_prompts')}</h2>
                    <Link href="/prompts/popular" className="view-all" prefetch={true}>
                        {t('popular.view_all')} <i className="fa-solid fa-chevron-right"></i>
                    </Link>
                </div>
                <div className="prompt-grid">
                    {featuredPrompts.map((prompt) => (
                        <PromptCard
                            key={prompt.slug}
                            prompt={prompt}
                            featured={prompt.featured}
                            isNew={prompt.isNew}
                        />
                    ))}
                </div>
            </section>

            {/* Browse categories */}
            <section className="categories">
                <div className="section-header">
                    <h2>{t('categories.title')}</h2>
                </div>
                <div className="category-container">
                    {categories.map(category => (
                        <CategoryItem key={category.slug} category={category} />
                    ))}
                </div>
            </section>

            {/* Recently added */}
            <section className="recent">
                <div className="section-header">
                    <h2>{t('homepage.recently_added')}</h2>
                    <Link href="/prompts" className="view-all" prefetch={true}>
                        {t('categories.view_all')} <i className="fa-solid fa-chevron-right"></i>
                    </Link>
                </div>
                <div className="prompt-grid">
                    {recentPrompts.map(prompt => (
                        <PromptCard
                            key={prompt.slug}
                            prompt={prompt}
                            featured={prompt.featured}
                            isNew={true}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
