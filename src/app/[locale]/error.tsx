'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const t = useTranslations('ErrorBoundary');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-boundary-fallback">
      <h2>{t('heading')}</h2>
      <p>{error.message || t('fallback')}</p>
      <button type="button" className="back-link" onClick={reset}>
        {t('tryAgain')}
      </button>
    </div>
  );
}
