import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '../types';

const API_BASE = 'https://rickandmortyapi.com/api/character';

async function fetchCharacters(
  searchTerm: string,
  page: number,
  signal: AbortSignal
): Promise<ApiResponse> {
  const url = searchTerm
    ? `${API_BASE}?name=${encodeURIComponent(searchTerm)}&page=${page}`
    : `${API_BASE}?page=${page}`;

  const response = await fetch(url, { signal });

  if (response.status === 404) {
    return { results: [], info: { count: 0, pages: 0, next: null, prev: null } };
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ApiResponse>;
}

export function useCharactersQuery(searchTerm: string, page: number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['characters', searchTerm, page],
    queryFn: ({ signal }) => fetchCharacters(searchTerm, page, signal),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['characters', searchTerm, page] });
  };

  return { ...query, refresh };
}
