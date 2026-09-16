"use client";

import Link from 'next/link';
import { useTranslation } from '../lib/i18n';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          Prompt<span>Library</span>
        </div>

        <div className="footer-links">
          <div className="footer-links-section">
            <h4>{t('footer.navigation')}</h4>
            <div className="footer-links-items">
              <Link href="/">{t('nav.home')}</Link>
              <Link href="/categories">{t('nav.categories')}</Link>
              <Link href="/prompts/popular">{t('nav.popular')}</Link>
              <Link href="/about">{t('nav.about')}</Link>
            </div>
          </div>

          <div className="footer-links-section">
            <h4>{t('footer.resources')}</h4>
            <div className="footer-links-items">
              <a href="https://github.com/MrXie23/PromptLibrary" target="_blank" rel="noopener noreferrer">{t('footer.github_repo')}</a>
              <a href="https://github.com/MrXie23/PromptLibrary/issues" target="_blank" rel="noopener noreferrer">{t('footer.feedback')}</a>
              <a href="https://github.com/MrXie23/PromptLibrary/blob/main/README.md" target="_blank" rel="noopener noreferrer">{t('footer.documentation')}</a>
            </div>
          </div>

          <div className="footer-links-section">
            <h4>{t('footer.legal')}</h4>
            <div className="footer-links-items">
              <Link href="/terms">{t('footer.terms')}</Link>
              <Link href="/privacy">{t('footer.privacy')}</Link>
              <Link href="/cookies">{t('footer.cookies')}</Link>
            </div>
          </div>
        </div>

        <div className="footer-social">
          <a href="https://twitter.com/promptlibrary" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a href="https://github.com/MrXie23/PromptLibrary" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fa-brands fa-github"></i>
          </a>
          <a href="https://discord.gg/promptlibrary" target="_blank" rel="noopener noreferrer" aria-label="Discord">
            <i className="fa-brands fa-discord"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} PromptLibrary. {t('footer.rights')}</p>
      </div>
    </footer>
  );
}
