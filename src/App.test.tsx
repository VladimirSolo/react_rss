import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import { ApiResponse } from './types';

const STORAGE_KEY = 'searchTerm';
const suppressError = (event: ErrorEvent) => event.preventDefault();

const mockApiResponse: ApiResponse = {
  info: { count: 1, pages: 1, next: null, prev: null },
  results: [{ id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human' }],
};

function makeFetchOk(data: ApiResponse) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  } as unknown as Response);
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    window.addEventListener('error', suppressError);
  });

  afterEach(() => {
    localStorage.clear();
    window.removeEventListener('error', suppressError);
    vi.restoreAllMocks();
  });

  it('renders search input and button', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<App />);
    expect(
      screen.getByPlaceholderText('Search by character name...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders error button', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<App />);
    expect(
      screen.getByRole('button', { name: 'Throw Error' })
    ).toBeInTheDocument();
  });

  it('makes initial API call on mount', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<App />);
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('loads search term from localStorage on initial mount', async () => {
    localStorage.setItem(STORAGE_KEY, 'morty');
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<App />);
    expect(screen.getByDisplayValue('morty')).toBeInTheDocument();
  });

  it('calls API with saved localStorage term on initial load', async () => {
    localStorage.setItem(STORAGE_KEY, 'summer');
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<App />);
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('name=summer')
      );
    });
  });

  it('shows spinner while loading', () => {
    globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('displays results after successful API call', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });
  });

  it('updates results when user performs new search', async () => {
    const user = userEvent.setup();
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<App />);
    await waitFor(() => screen.getByText('Rick Sanchez'));

    const input = screen.getByPlaceholderText('Search by character name...');
    await user.clear(input);
    await user.type(input, 'morty');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('activates error boundary fallback when error button is clicked', async () => {
    const user = userEvent.setup();
    globalThis.fetch = makeFetchOk(mockApiResponse);
    render(<App />);
    await waitFor(() => screen.getByText('Rick Sanchez'));

    await user.click(screen.getByRole('button', { name: 'Throw Error' }));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('handles API error on initial load', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as unknown as Response);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Request failed: 500/)).toBeInTheDocument();
    });
  });
});
