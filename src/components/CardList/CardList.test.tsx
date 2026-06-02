import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CardList from './CardList';
import { Character } from '../../types';

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
  it('shows "no results" message when items array is empty', () => {
    render(
      <MemoryRouter>
        <CardList items={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText('No characters found.')).toBeInTheDocument();
  });

  it('renders correct number of cards when items are provided', () => {
    render(
      <MemoryRouter>
        <CardList items={mockItems} />
      </MemoryRouter>
    );
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getByText('Summer Smith')).toBeInTheDocument();
  });

  it('renders card-list container when items exist', () => {
    const { container } = render(
      <MemoryRouter>
        <CardList items={mockItems} />
      </MemoryRouter>
    );
    expect(container.querySelector('.card-list')).toBeInTheDocument();
  });

  it('renders single item correctly', () => {
    const single = [mockItems[0]];
    render(
      <MemoryRouter>
        <CardList items={single} />
      </MemoryRouter>
    );
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.queryByText('No characters found.')).not.toBeInTheDocument();
  });
});
