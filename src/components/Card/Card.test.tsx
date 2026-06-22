import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Card from './Card';
import { Character } from '../../types';
import { useSelectionStore } from '../../store/selectionStore';

type LinkProps = {
  href: string | { pathname: string; query?: Record<string, string> };
  children: ReactNode;
  className?: string;
};

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
}));

vi.mock('../../i18n/navigation', () => ({
  Link: ({ href, children, className }: LinkProps) => (
    <a href={typeof href === 'string' ? href : href.pathname} className={className}>
      {children}
    </a>
  ),
}));

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

  it('renders a checkbox for selection', () => {
    render(<Card item={mockCharacter} />);
    expect(
      screen.getByRole('checkbox', { name: /Select Rick Sanchez/i })
    ).toBeInTheDocument();
  });

  it('checkbox is unchecked by default', () => {
    render(<Card item={mockCharacter} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('clicking checkbox selects the item', async () => {
    const user = userEvent.setup();
    render(<Card item={mockCharacter} />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(useSelectionStore.getState().selectedItems[1]).toEqual(mockCharacter);
  });

  it('clicking checkbox again deselects the item', async () => {
    const user = userEvent.setup();
    render(<Card item={mockCharacter} />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(useSelectionStore.getState().selectedItems[1]).toBeUndefined();
  });

  it('adds card--selected class when item is selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<Card item={mockCharacter} />);
    await user.click(screen.getByRole('checkbox'));
    expect(container.querySelector('.card--selected')).toBeInTheDocument();
  });

  it('reflects pre-existing selection state from store', () => {
    useSelectionStore.setState({ selectedItems: { 1: mockCharacter } });
    render(<Card item={mockCharacter} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('does not add card--selected class when item is not selected', () => {
    const { container } = render(<Card item={mockCharacter} />);
    expect(container.querySelector('.card--selected')).not.toBeInTheDocument();
  });
});
