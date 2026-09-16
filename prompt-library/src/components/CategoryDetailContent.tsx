"use client";

import Link from 'next/link';
import { useTranslation } from '../lib/i18n';
import { CategoryData, PromptData } from '@/types';
import dynamic from 'next/dynamic';

// Dynamically import the client component to avoid server-rendering issues
const PaginatedPrompts = dynamic(() => import('@/components/PaginatedPrompts'), { ssr: false });

interface CategoryDetailContentProps {
    category: CategoryData;
    categoryPrompts: PromptData[];
}

export default function CategoryDetailContent({ category, categoryPrompts }: CategoryDetailContentProps) {
    const { t } = useTranslation();

    const categoryName = category.nameKey ? t(category.nameKey) : category.name;

    // Only pass the first page of data as the initial data
    const initialPageData = categoryPrompts.slice(0, 9);
    const totalPages = Math.ceil(categoryPrompts.length / 9);

    return (
        <main>
            <section className="page-header">
                <Link href="/categories" className="back-link">
                    <i className="fa-solid fa-arrow-left"></i> {t('ui.back_to_categories')}
                </Link>
                <h1>{categoryName}</h1>
                <p>{t('categories.prompt_count_total', { count: categoryPrompts.length.toString() })}</p>
            </section>

            <section className="prompts-list">
                {categoryPrompts.length > 0 ? (
                    <PaginatedPrompts
                        type="category"
                        category={category.name}
                        initialData={initialPageData}
                        initialMeta={{
                            total: categoryPrompts.length,
                            perPage: 9,
                            totalPages: totalPages,
                            category: category.name
                        }}
                    />
                ) : (
                    <div className="empty-state">
                        <p>{t('ui.no_prompts_in_category')}</p>
                        <Link href="/prompts" className="view-button">
                            {t('ui.browse_all_prompts')}
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}
