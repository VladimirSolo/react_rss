'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../../i18n/navigation';
import { useTheme } from '../../hooks/useTheme';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';

function Navigation() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="nav">
      <Link
        href="/"
        className={`nav-link${pathname === '/' ? ' active' : ''}`}
      >
        {t('home')}
      </Link>
      <Link
        href="/about"
        className={`nav-link${pathname === '/about' ? ' active' : ''}`}
      >
        {t('about')}
      </Link>
      <Suspense fallback={null}>
        <LocaleSwitcher />
      </Suspense>
      <button className="theme-toggle" type="button" onClick={toggleTheme}>
        {theme === 'light' ? t('themeToDark') : t('themeToLight')}
      </button>
    </nav>
  );
}

export default Navigation;
