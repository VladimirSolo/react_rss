import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiResponse, Character } from '../../types';
import CardList from '../CardList/CardList';
import Pagination from '../Pagination/Pagination';
import Spinner from '../Spinner/Spinner';

const API_BASE = 'https://rickandmortyapi.com/api/character';

interface ResultsSectionProps {
  searchTerm: string;
}

export default function ResultsSection({ searchTerm }: ResultsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);

  const [items, setItems] = useState<Character[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const url = searchTerm
          ? `${API_BASE}?name=${encodeURIComponent(searchTerm)}&page=${page}`
          : `${API_BASE}?page=${page}`;

        const response = await fetch(url, { signal: controller.signal });

        if (response.status === 404) {
          setItems([]);
          setTotalPages(0);
          return;
        }

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        setItems(data.results);
        setTotalPages(data.info.pages);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [searchTerm, page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
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
