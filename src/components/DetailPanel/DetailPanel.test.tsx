import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DetailPanel from './DetailPanel';
import { Character } from '../../types';

type LinkProps = {
  href: string | { pathname: string; query?: Record<string, string> };
  children: ReactNode;
  className?: string;
};

const getCharacter = vi.fn();

vi.mock('../../lib/api', () => ({
  getCharacter: (id: string) => getCharacter(id),
}));

vi.mock('../../i18n/navigation', () => ({
  Link: ({ href, children, className }: LinkProps) => {
    const resolved =
      typeof href === 'string'
        ? href
        : `${href.pathname}?${new URLSearchParams(href.query).toString()}`;
    return (
      <a href={resolved} className={className}>
        {children}
      </a>
    );
  },
  useRouter: () => ({ refresh: vi.fn() }),
}));

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://example.com/rick.png',
};

interface RenderProps {
  id?: string;
  page?: number;
  query?: string;
}

async function renderDetailPanel({
  id = '1',
  page = 1,
  query = '',
}: RenderProps) {
  const jsx = await DetailPanel({ id, page, query });
  return render(jsx);
}

describe('DetailPanel', () => {
  beforeEach(() => {
    getCharacter.mockReset();
  });

  it('renders character details after a successful fetch', async () => {
    getCharacter.mockResolvedValue(rick);
    await renderDetailPanel({});
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText(/Earth \(C-137\)/)).toBeInTheDocument();
    expect(screen.getByText(/Citadel of Ricks/)).toBeInTheDocument();
    expect(screen.getByText(/Male/)).toBeInTheDocument();
  });

  it('shows a not-found message when the character does not exist', async () => {
    getCharacter.mockResolvedValue(null);
    await renderDetailPanel({});
    expect(screen.getByText('Character not found.')).toBeInTheDocument();
  });

  it('shows an error message when the fetch fails', async () => {
    getCharacter.mockRejectedValue(new Error('Network error'));
    await renderDetailPanel({});
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders the close link back to the list, preserving page and query', async () => {
    getCharacter.mockResolvedValue(rick);
    await renderDetailPanel({ page: 2, query: 'rick' });
    const close = screen.getByRole('link', { name: /Close/ });
    expect(close.getAttribute('href')).toContain('page=2');
    expect(close.getAttribute('href')).toContain('query=rick');
  });

  it('renders a refresh button', async () => {
    getCharacter.mockResolvedValue(rick);
    await renderDetailPanel({});
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  it('renders the character image', async () => {
    getCharacter.mockResolvedValue(rick);
    await renderDetailPanel({});
    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toBeInTheDocument();
  });
});
