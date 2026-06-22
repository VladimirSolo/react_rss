import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResultsList from './ResultsList';
import { Character } from '../../types';

type LinkProps = {
  href: string | { pathname: string; query?: Record<string, string> };
  children: ReactNode;
  className?: string;
};

const getCharacters = vi.fn();

vi.mock('../../lib/api', () => ({
  getCharacters: (query: string, page: number) => getCharacters(query, page),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('../../i18n/navigation', () => ({
  Link: ({ href, children, className }: LinkProps) => (
    <a href={typeof href === 'string' ? href : href.pathname} className={className}>
      {children}
    </a>
  ),
  useRouter: () => ({ refresh: vi.fn() }),
}));

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: '',
};

interface RenderProps {
  query?: string;
  page?: number;
  basePath?: string;
}

async function renderResultsList({
  query = '',
  page = 1,
  basePath = '/',
}: RenderProps) {
  const jsx = await ResultsList({ query, page, basePath });
  return render(jsx);
}

describe('ResultsList', () => {
  beforeEach(() => {
    getCharacters.mockReset();
  });

  it('renders cards for fetched characters', async () => {
    getCharacters.mockResolvedValue({
      results: [rick],
      info: { count: 1, pages: 1, next: null, prev: null },
    });
    await renderResultsList({});
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('shows the empty state when there are no results', async () => {
    getCharacters.mockResolvedValue({
      results: [],
      info: { count: 0, pages: 0, next: null, prev: null },
    });
    await renderResultsList({});
    expect(screen.getByText('No characters found.')).toBeInTheDocument();
  });

  it('shows an error message when the fetch fails', async () => {
    getCharacters.mockRejectedValue(new Error('Network down'));
    await renderResultsList({});
    expect(screen.getByText('Network down')).toBeInTheDocument();
  });

  it('renders pagination when there is more than one page', async () => {
    getCharacters.mockResolvedValue({
      results: [rick],
      info: { count: 21, pages: 2, next: null, prev: null },
    });
    await renderResultsList({ page: 1 });
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('does not render pagination for a single page', async () => {
    getCharacters.mockResolvedValue({
      results: [rick],
      info: { count: 1, pages: 1, next: null, prev: null },
    });
    await renderResultsList({});
    expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument();
  });

  it('renders a refresh button', async () => {
    getCharacters.mockResolvedValue({
      results: [rick],
      info: { count: 1, pages: 1, next: null, prev: null },
    });
    await renderResultsList({});
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });
});
