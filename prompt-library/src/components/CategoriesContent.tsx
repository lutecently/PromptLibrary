"use client";

import { CategoryData } from '@/types';
import CategoryItem from '@/components/CategoryItem';
import { useTranslation } from '../lib/i18n';

interface CategoriesContentProps {
    categories: CategoryData[];
}

export default function CategoriesContent({ categories }: CategoriesContentProps) {
    const { t } = useTranslation();

    return (
        <main>
            <section className="page-header">
                <h1>{t('categories.title')}</h1>
                <p>{t('categories.subtitle')}</p>
            </section>

            <section className="categories-list">
                <div className="category-container">
                    {categories.map(category => (
                        <CategoryItem key={category.slug} category={category} />
                    ))}
                </div>
            </section>
        </main>
    );
}
