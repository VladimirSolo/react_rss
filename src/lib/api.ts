import { ApiResponse, Character } from '../types';

const API_BASE = 'https://rickandmortyapi.com/api/character';
const CACHE_TTL_SECONDS = Math.floor(
  Number(process.env.CACHE_TTL_MS ?? 300_000) / 1000
);

export async function getCharacters(
  query: string,
  page: number
): Promise<ApiResponse> {
  const url = query
    ? `${API_BASE}?name=${encodeURIComponent(query)}&page=${page}`
    : `${API_BASE}?page=${page}`;

  const response = await fetch(url, {
    next: { revalidate: CACHE_TTL_SECONDS },
  });

  if (response.status === 404) {
    return { results: [], info: { count: 0, pages: 0, next: null, prev: null } };
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ApiResponse>;
}

export async function getCharacter(id: string): Promise<Character | null> {
  const response = await fetch(`${API_BASE}/${id}`, {
    next: { revalidate: CACHE_TTL_SECONDS },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<Character>;
}
