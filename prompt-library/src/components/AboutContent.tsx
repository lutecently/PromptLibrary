"use client";

import Link from 'next/link';
import { useTranslation } from '../lib/i18n';

export default function AboutContent() {
    const { t } = useTranslation();

    return (
        <main>
            <section className="page-header">
                <h1>{t('about.title')}</h1>
                <p>{t('about.subtitle')}</p>
            </section>

            <section className="content-section">
                <h2>{t('about.mission')}</h2>
                <p>{t('about.mission_text')}</p>

                <h2>{t('about.team')}</h2>
                <p>{t('about.description')}</p>

                <h2>{t('about.vision')}</h2>
                <p>{t('about.vision_text')}</p>

                <div className="cta-buttons">
                    <Link href="https://github.com/MrXie23/PromptLibrary/blob/main/README.md" className="view-button">
                        {t('ui.how_to_contribute')}
                    </Link>
                    <a
                        href="https://github.com/MrXie23/PromptLibrary"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-button secondary"
                    >
                        {t('footer.github_repo')}
                    </a>
                </div>
            </section>
        </main>
    );
}
