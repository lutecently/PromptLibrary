"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '../lib/i18n';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Check the user's system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);

    // Detect whether this is a mobile device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkIfMobile();

    // Listen for window resizes
    window.addEventListener('resize', checkIfMobile);

    // Clean up the listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Lock/unlock background scrolling
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleSearchClick = () => {
    router.push('/search');
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  const handleNavLinkClick = () => {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          Prompt<span>Library</span>
        </Link>
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link
            href="/"
            className={pathname === '/' || pathname === '/PromptLibrary/' ? 'active' : ''}
            onClick={handleNavLinkClick}
          >
            {t('nav.home')}
          </Link>
          <Link
            href="/categories"
            className={pathname === '/categories' || pathname === '/PromptLibrary/categories' ? 'active' : ''}
            onClick={handleNavLinkClick}
          >
            {t('nav.categories')}
          </Link>
          <Link
            href="/prompts/popular"
            className={pathname === '/prompts/popular' || pathname === '/PromptLibrary/prompts/popular' ? 'active' : ''}
            onClick={handleNavLinkClick}
          >
            {t('nav.popular')}
          </Link>
          <Link
            href="/about"
            className={pathname === '/about' || pathname === '/PromptLibrary/about' ? 'active' : ''}
            onClick={handleNavLinkClick}
          >
            {t('nav.about')}
          </Link>
        </div>
        <div className="nav-actions">
          <Link href="/admin/new" className="search-btn" title="New Prompt" onClick={handleNavLinkClick}>
            <i className="fa-solid fa-plus"></i>
          </Link>
          <button onClick={handleSearchClick} className="search-btn">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          {isMobile && (
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
