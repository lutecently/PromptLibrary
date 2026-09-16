"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../lib/i18n';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <form className="search-container max-w-3xl mx-auto flex items-center border rounded-full shadow-lg overflow-hidden bg-white" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t('hero.search_placeholder')}
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-4 text-lg border-none focus:outline-none focus:ring-0 w-full"
          />
          <button
            type="submit"
            className="search-button py-4 px-8 text-lg font-medium bg-blue-500 hover:bg-blue-600 transition-colors text-white"
          >
            {t('hero.search_button')}
          </button>
        </form>
      </div>
    </section>
  );
}
