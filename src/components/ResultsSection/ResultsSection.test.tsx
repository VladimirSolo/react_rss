import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ResultsSection from './ResultsSection';
import { ApiResponse } from '../../types';

const mockApiResponse: ApiResponse = {
  info: { count: 2, pages: 1, next: null, prev: null },
  results: [
    { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human' },
    { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human' },
  ],
};

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

describe('ResultsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows spinner while loading', () => {
    globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));
    render(<ResultsSection searchTerm="" />);
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('renders list of characters on successful API response', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<ResultsSection searchTerm="" />);
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
  });

  it('shows "no results" message when API returns 404', async () => {
    globalThis.fetch = makeFetchStatus(404);
    render(<ResultsSection searchTerm="nonexistent" />);
    await waitFor(() => {
      expect(screen.getByText('No characters found.')).toBeInTheDocument();
    });
  });

  it('shows error message when API returns 5xx', async () => {
    globalThis.fetch = makeFetchStatus(500);
    render(<ResultsSection searchTerm="" />);
    await waitFor(() => {
      expect(screen.getByText(/Request failed: 500/)).toBeInTheDocument();
    });
  });

  it('calls fetch with search term in URL', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<ResultsSection searchTerm="rick" />);
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('name=rick')
      );
    });
  });

  it('calls fetch without name param when searchTerm is empty', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<ResultsSection searchTerm="" />);
    await waitFor(() => {
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).not.toContain('name=');
    });
  });

  it('refetches when searchTerm prop changes', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    const { rerender } = render(<ResultsSection searchTerm="rick" />);
    await waitFor(() => screen.getByText('Rick Sanchez'));

    rerender(<ResultsSection searchTerm="morty" />);
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('does not refetch when searchTerm prop stays the same', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    const { rerender } = render(<ResultsSection searchTerm="rick" />);
    await waitFor(() => screen.getByText('Rick Sanchez'));

    rerender(<ResultsSection searchTerm="rick" />);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles network error gracefully', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<ResultsSection searchTerm="" />);
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('handles unknown error type gracefully', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue('string error');
    render(<ResultsSection searchTerm="" />);
    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
  });

  it('shows empty list when API returns empty results', async () => {
    globalThis.fetch = makeFetchOk({ ...mockApiResponse, results: [] });
    render(<ResultsSection searchTerm="" />);
    await waitFor(() => {
      expect(screen.getByText('No characters found.')).toBeInTheDocument();
    });
  });
});
