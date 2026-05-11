import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';
import { Character } from '../../types';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
};

const morty: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
};

describe('Card', () => {
  it('displays character name', () => {
    render(<Card item={mockCharacter} />);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('displays character status and species', () => {
    render(<Card item={mockCharacter} />);
    expect(screen.getByText(/Alive/)).toBeInTheDocument();
    expect(screen.getByText(/Human/)).toBeInTheDocument();
  });

  it('renders card container with correct class', () => {
    const { container } = render(<Card item={mockCharacter} />);
    expect(container.querySelector('.card')).toBeInTheDocument();
  });

  it('displays different character data correctly', () => {
    render(<Card item={morty} />);
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });
});
