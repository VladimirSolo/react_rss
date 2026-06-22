'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

function ErrorButton() {
  const t = useTranslations('ErrorButton');
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error triggered by user');
  }

  return (
    <button
      className="error-trigger-btn"
      type="button"
      onClick={() => setShouldThrow(true)}
    >
      {t('label')}
    </button>
  );
}

export default ErrorButton;
