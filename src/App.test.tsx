import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { ApiResponse } from './types';

const suppressError = (event: ErrorEvent) => event.preventDefault();

const mockApiResponse: ApiResponse = {
  info: { count: 1, pages: 1, next: null, prev: null },
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
      image: 'https://example.com/rick.png',
    },
  ],
};

function makeFetchOk(data: ApiResponse) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  } as unknown as Response);
}

function renderApp(initialPath = '/?page=1') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  );
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
    renderApp();
    expect(
      screen.getByPlaceholderText('Search by character name...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders error button', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderApp();
    expect(
      screen.getByRole('button', { name: 'Throw Error' })
    ).toBeInTheDocument();
  });

  it('makes initial API call on mount', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderApp();
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('loads search term from localStorage on initial mount', async () => {
    localStorage.setItem('searchTerm', '"morty"');
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderApp();
    expect(screen.getByDisplayValue('morty')).toBeInTheDocument();
  });

  it('calls API with saved localStorage term on initial load', async () => {
    localStorage.setItem('searchTerm', '"summer"');
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderApp();
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('name=summer'),
        expect.any(Object)
      );
    });
  });

  it('shows spinner while loading', () => {
    globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));
    renderApp();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('displays results after successful API call', async () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });
  });

  it('updates results when user performs new search', async () => {
    const user = userEvent.setup();
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderApp();
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
    renderApp();
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
    renderApp();
    await waitFor(() => {
      expect(screen.getByText(/500 Internal Server Error/)).toBeInTheDocument();
    });
  });

  it('renders navigation links', () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderApp();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('renders 404 page for unknown routes', () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderApp('/nonexistent-route');
    expect(screen.getByText('404 — Page Not Found')).toBeInTheDocument();
  });

  it('renders about page', () => {
    globalThis.fetch = makeFetchOk(mockApiResponse);
    renderApp('/about');
    expect(screen.getByText('RS School React course')).toBeInTheDocument();
    expect(screen.getByText(/Vladimir Solo/)).toBeInTheDocument();
  });
});
