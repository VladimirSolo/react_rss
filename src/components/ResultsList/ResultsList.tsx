import { getTranslations } from 'next-intl/server';
import { getCharacters } from '../../lib/api';
import { Character } from '../../types';
import CardList from '../CardList/CardList';
import Pagination from '../Pagination/Pagination';
import RefreshButton from '../RefreshButton/RefreshButton';

interface ResultsListProps {
  query: string;
  page: number;
  basePath: string;
}

export default async function ResultsList({
  query,
  page,
  basePath,
}: ResultsListProps) {
  const t = await getTranslations('Results');

  let items: Character[] = [];
  let totalPages = 0;
  let errorMessage: string | null = null;

  try {
    const data = await getCharacters(query, page);
    items = data.results;
    totalPages = data.info.pages;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : t('error');
  }

  const pagination =
    !errorMessage && totalPages > 1
      ? await Pagination({ currentPage: page, totalPages, query, basePath })
      : null;

  return (
    <>
      <div className="results-toolbar">
        <RefreshButton
          label={t('refresh')}
          refreshingLabel={t('refreshing')}
          ariaLabel={t('refresh')}
        />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!errorMessage && items.length === 0 && (
        <p className="no-results">{t('empty')}</p>
      )}

      {!errorMessage && items.length > 0 && <CardList items={items} />}

      {pagination}
    </>
  );
}
