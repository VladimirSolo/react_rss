import { getTranslations } from 'next-intl/server';
import { searchAction } from '../../actions/search';

interface SearchSectionProps {
  initialQuery: string;
}

export default async function SearchSection({
  initialQuery,
}: SearchSectionProps) {
  const t = await getTranslations('Search');

  return (
    <form className="search-section" action={searchAction}>
      <h1>{t('title')}</h1>
      <input
        className="search-input"
        type="text"
        name="query"
        defaultValue={initialQuery}
        placeholder={t('placeholder')}
      />
      <button className="search-btn" type="submit">
        {t('button')}
      </button>
    </form>
  );
}
