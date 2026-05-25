import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Card from './Card';
import { Character } from '../../types';
import { useSelectionStore } from '../../store/selectionStore';

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

beforeEach(() => {
  useSelectionStore.setState({ selectedItems: {} });
});

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

  it('renders a checkbox for selection', () => {
    render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('checkbox', { name: /Select Rick Sanchez/i })
    ).toBeInTheDocument();
  });

  it('checkbox is unchecked by default', () => {
    render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('clicking checkbox selects the item', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(useSelectionStore.getState().selectedItems[1]).toEqual(mockCharacter);
  });

  it('clicking checkbox again deselects the item', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(useSelectionStore.getState().selectedItems[1]).toBeUndefined();
  });

  it('adds card--selected class when item is selected', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    await user.click(screen.getByRole('checkbox'));
    expect(container.querySelector('.card--selected')).toBeInTheDocument();
  });

  it('reflects pre-existing selection state from store', () => {
    useSelectionStore.setState({ selectedItems: { 1: mockCharacter } });
    render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('does not add card--selected class when item is not selected', () => {
    const { container } = render(
      <MemoryRouter>
        <Card item={mockCharacter} />
      </MemoryRouter>
    );
    expect(container.querySelector('.card--selected')).not.toBeInTheDocument();
  });
});
