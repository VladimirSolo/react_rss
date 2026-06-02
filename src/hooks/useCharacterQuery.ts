import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Character } from '../types';

const API_BASE = 'https://rickandmortyapi.com/api/character';

async function fetchCharacter(
  id: string,
  signal: AbortSignal
): Promise<Character> {
  const response = await fetch(`${API_BASE}/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<Character>;
}

export function useCharacterQuery(id: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['character', id],
    queryFn: ({ signal }) => fetchCharacter(id!, signal),
    enabled: !!id,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['character', id] });
  };

  return { ...query, refresh };
}
