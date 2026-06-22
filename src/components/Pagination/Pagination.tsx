import { getTranslations } from 'next-intl/server';
import { Link } from '../../i18n/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  query: string;
  basePath: string;
}

export default async function Pagination({
  currentPage,
  totalPages,
  query,
  basePath,
}: PaginationProps) {
  const t = await getTranslations('Pagination');

  const queryFor = (page: number): Record<string, string> =>
    query ? { page: String(page), query } : { page: String(page) };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div className="pagination">
      {prevDisabled ? (
        <span className="pagination-btn pagination-btn--disabled">
          {t('prev')}
        </span>
      ) : (
        <Link
          className="pagination-btn"
          href={{ pathname: basePath, query: queryFor(currentPage - 1) }}
        >
          {t('prev')}
        </Link>
      )}
      <span className="pagination-info">
        {t('pageInfo', { current: currentPage, total: totalPages })}
      </span>
      {nextDisabled ? (
        <span className="pagination-btn pagination-btn--disabled">
          {t('next')}
        </span>
      ) : (
        <Link
          className="pagination-btn"
          href={{ pathname: basePath, query: queryFor(currentPage + 1) }}
        >
          {t('next')}
        </Link>
      )}
    </div>
  );
}
