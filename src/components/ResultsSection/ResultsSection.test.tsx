import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResultsSection from './ResultsSection';
import { ApiResponse } from '../../types';

const mockApiResponse: ApiResponse = {
  info: { count: 2, pages: 1, next: null, prev: null },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Earth', url: '' },
      image: '',
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Earth', url: '' },
      image: '',
    },
  ],
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  });
}

function makeFetchOk(data: ApiResponse) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  } as unknown as Response);
}

function makeFetchStatus(status: number) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: status === 404 ? 'Not Found' : 'Internal Server Error',
    json: () => Promise.resolve({}),
  } as unknown as Response);
}

function renderWithRouter(
  searchTerm: string,
  initialPath = '/?page=1',
  queryClient = makeQueryClient()
) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <ResultsSection searchTerm={searchTerm} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ResultsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows spinner while loading', () => {
    globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));
    renderWithRouter('');
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('renders list of characters on successful API response', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderWithRouter('');
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
  });

  it('shows "no results" message when API returns 404', async () => {
    globalThis.fetch = makeFetchStatus(404);
    renderWithRouter('nonexistent');
    await waitFor(() => {
      expect(screen.getByText('No characters found.')).toBeInTheDocument();
    });
  });

  it('shows error message when API returns 5xx', async () => {
    globalThis.fetch = makeFetchStatus(500);
    renderWithRouter('');
    await waitFor(() => {
      expect(screen.getByText(/500 Internal Server Error/)).toBeInTheDocument();
    });
  });

  it('calls fetch with search term in URL', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderWithRouter('rick');
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('name=rick'),
        expect.any(Object)
      );
    });
  });

  it('calls fetch without name param when searchTerm is empty', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderWithRouter('');
    await waitFor(() => {
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0][0] as string;
      expect(url).not.toContain('name=');
    });
  });

  it('refetches when searchTerm prop changes', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    const queryClient = makeQueryClient();
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <ResultsSection searchTerm="rick" />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => screen.getByText('Rick Sanchez'));

    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <ResultsSection searchTerm="morty" />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('does not refetch when searchTerm prop stays the same', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    const queryClient = makeQueryClient();
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <ResultsSection searchTerm="rick" />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => screen.getByText('Rick Sanchez'));

    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <ResultsSection searchTerm="rick" />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles network error gracefully', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    renderWithRouter('');
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('handles unknown error type gracefully', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue('string error');
    renderWithRouter('');
    await waitFor(() => {
      expect(screen.getByText('Unexpected error')).toBeInTheDocument();
    });
  });

  it('shows empty list when API returns empty results', async () => {
    globalThis.fetch = makeFetchOk({ ...mockApiResponse, results: [] });
    renderWithRouter('');
    await waitFor(() => {
      expect(screen.getByText('No characters found.')).toBeInTheDocument();
    });
  });

  it('shows pagination when totalPages > 1', async () => {
    globalThis.fetch = makeFetchOk({
      ...mockApiResponse,
      info: { count: 40, pages: 2, next: 'url', prev: null },
    });
    renderWithRouter('');
    await waitFor(() => {
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });
  });

  it('does not show pagination when totalPages is 1', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderWithRouter('');
    await waitFor(() => screen.getByText('Rick Sanchez'));
    expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument();
  });

  it('renders refresh button', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderWithRouter('');
    await waitFor(() => screen.getByText('Rick Sanchez'));
    expect(screen.getByRole('button', { name: /Refresh results/i })).toBeInTheDocument();
  });

  it('invalidates cache and refetches when refresh button is clicked', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <ResultsSection searchTerm="" />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByText('Rick Sanchez'));
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Refresh results/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
