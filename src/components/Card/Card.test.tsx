import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Card from './Card';
import { Character } from '../../types';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://example.com/rick.png',
};

const morty: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://example.com/morty.png',
};

describe('Card', () => {
  it('displays character name', () => {
    render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('displays character status and species', () => {
    render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Alive/)).toBeInTheDocument();
    expect(screen.getByText(/Human/)).toBeInTheDocument();
  });

  it('renders card container with correct class', () => {
    const { container } = render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    expect(container.querySelector('.card')).toBeInTheDocument();
  });

  it('displays different character data correctly', () => {
    render(
      <MemoryRouter>
        <Card item={morty} />
      </MemoryRouter>
    );
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });
});
