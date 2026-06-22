'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '../../i18n/navigation';
import { routing } from '../../i18n/routing';

function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChange = (nextLocale: string): void => {
    const search = searchParams.toString();
    const href = search ? `${pathname}?${search}` : pathname;
    router.replace(href, { locale: nextLocale });
  };

  return (
    <div className="locale-switcher" role="group" aria-label={t('label')}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          className={`locale-switcher-btn${loc === locale ? ' active' : ''}`}
          aria-pressed={loc === locale}
          onClick={() => handleChange(loc)}
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}

export default LocaleSwitcher;
