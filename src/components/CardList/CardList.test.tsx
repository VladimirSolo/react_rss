import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardList from './CardList';
import { Character } from '../../types';

const mockItems: Character[] = [
  { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human' },
  { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human' },
  { id: 3, name: 'Summer Smith', status: 'Alive', species: 'Human' },
];

describe('CardList', () => {
  it('shows "no results" message when items array is empty', () => {
    render(<CardList items={[]} />);
    expect(screen.getByText('No characters found.')).toBeInTheDocument();
  });

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
    expect(screen.queryByText('No characters found.')).not.toBeInTheDocument();
  });
});
