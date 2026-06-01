import { QueryClient } from '@tanstack/react-query';

const cacheTtl = Number(import.meta.env.VITE_CACHE_TTL_MS ?? 300_000);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cacheTtl,
      retry: 1,
    },
  },
});
