'use client';

import { MouseEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';
import { Character } from '../../types';
import { useSelectionStore } from '../../store/selectionStore';

interface CardProps {
  item: Character;
}

function Card({ item }: CardProps) {
  const t = useTranslations('Results');
  const searchParams = useSearchParams();
  const { selectedItems, toggle } = useSelectionStore();
  const isSelected = Boolean(selectedItems[item.id]);
  const search = searchParams.toString();

  const handleCheckboxClick = (e: MouseEvent): void => {
    e.stopPropagation();
  };

  const handleCheckboxChange = (): void => {
    toggle(item);
  };

  return (
    <Link
      href={`/details/${item.id}${search ? `?${search}` : ''}`}
      className={`card${isSelected ? ' card--selected' : ''}`}
    >
      <input
        type="checkbox"
        className="card-checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        onClick={handleCheckboxClick}
        aria-label={t('selectAria', { name: item.name })}
      />
      <h3 className="card-name">{item.name}</h3>
      <p className="card-description">
        {item.status} &mdash; {item.species}
      </p>
    </Link>
  );
}

export default Card;
