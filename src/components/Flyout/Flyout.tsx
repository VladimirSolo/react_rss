'use client';

import { useTranslations } from 'next-intl';
import { useSelectionStore } from '../../store/selectionStore';

export default function Flyout() {
  const t = useTranslations('Flyout');
  const { selectedItems, unselectAll } = useSelectionStore();
  const items = Object.values(selectedItems);
  const count = items.length;

  if (count === 0) return null;

  const ids = items.map((item) => item.id).join(',');

  return (
    <div className="flyout" role="region" aria-label="selected items">
      <span className="flyout-count">{t('count', { count })}</span>
      <button className="flyout-btn" type="button" onClick={unselectAll}>
        {t('unselectAll')}
      </button>
      <a
        className="flyout-btn flyout-btn--download"
        href={`/api/csv?ids=${ids}`}
      >
        {t('download')}
      </a>
    </div>
  );
}
