import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardList from './CardList';
import { Character } from '../../types';

type LinkProps = {
  href: string | { pathname: string; query?: Record<string, string> };
  children: ReactNode;
  className?: string;
};

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('../../i18n/navigation', () => ({
  Link: ({ href, children, className }: LinkProps) => (
    <a href={typeof href === 'string' ? href : href.pathname} className={className}>
      {children}
    </a>
  ),
}));

const mockItems: Character[] = [
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
  {
    id: 3,
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Female',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: '',
  },
];

describe('CardList', () => {
  it('renders correct number of cards when items are provided', () => {
    render(<CardList items={mockItems} />);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getByText('Summer Smith')).toBeInTheDocument();
  });

  it('renders card-list container when items exist', () => {
    const { container } = render(<CardList items={mockItems} />);
    expect(container.querySelector('.card-list')).toBeInTheDocument();
  });

  it('renders single item correctly', () => {
    const single = [mockItems[0]];
    render(<CardList items={single} />);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('renders an empty container when items array is empty', () => {
    const { container } = render(<CardList items={[]} />);
    expect(container.querySelector('.card-list')?.children.length).toBe(0);
  });
});
