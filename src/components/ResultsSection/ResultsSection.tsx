import { useSearchParams } from 'react-router-dom';
import { useCharactersQuery } from '../../hooks/useCharactersQuery';
import CardList from '../CardList/CardList';
import Pagination from '../Pagination/Pagination';
import Spinner from '../Spinner/Spinner';

interface ResultsSectionProps {
  searchTerm: string;
}

export default function ResultsSection({ searchTerm }: ResultsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);

  const { data, isLoading, isFetching, error, refresh } = useCharactersQuery(
    searchTerm,
    page
  );

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="error-message">
        {error instanceof Error ? error.message : 'Unexpected error'}
      </div>
    );
  }

  const items = data?.results ?? [];
  const totalPages = data?.info.pages ?? 0;

  return (
    <>
      <div className="results-toolbar">
        <button
          className="refresh-btn"
          type="button"
          onClick={refresh}
          disabled={isFetching}
          aria-label="Refresh results"
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      <CardList items={items} />
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
