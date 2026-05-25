import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Flyout from './Flyout';
import { useSelectionStore } from '../../store/selectionStore';
import { Character } from '../../types';

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

const morty: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: '',
};

beforeEach(() => {
  useSelectionStore.setState({ selectedItems: {} });
});

describe('Flyout', () => {
  it('renders nothing when no items are selected', () => {
    const { container } = render(<Flyout />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when at least one item is selected', () => {
    useSelectionStore.setState({ selectedItems: { 1: rick } });
    render(<Flyout />);
    expect(screen.getByRole('region', { name: 'selected items' })).toBeInTheDocument();
  });

  it('displays correct count for one item', () => {
    useSelectionStore.setState({ selectedItems: { 1: rick } });
    render(<Flyout />);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('displays correct count for multiple items with plural', () => {
    useSelectionStore.setState({ selectedItems: { 1: rick, 2: morty } });
    render(<Flyout />);
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('renders Unselect all and Download buttons', () => {
    useSelectionStore.setState({ selectedItems: { 1: rick } });
    render(<Flyout />);
    expect(screen.getByRole('button', { name: 'Unselect all' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
  });

  it('clears selection when Unselect all is clicked', async () => {
    const user = userEvent.setup();
    useSelectionStore.setState({ selectedItems: { 1: rick, 2: morty } });
    render(<Flyout />);
    await user.click(screen.getByRole('button', { name: 'Unselect all' }));
    expect(useSelectionStore.getState().selectedItems).toEqual({});
  });

  it('triggers CSV download when Download is clicked', async () => {
    const user = userEvent.setup();
    useSelectionStore.setState({ selectedItems: { 1: rick } });

    const mockCreateURL = vi.fn().mockReturnValue('blob:mock');
    const mockRevokeURL = vi.fn();
    vi.spyOn(URL, 'createObjectURL').mockImplementation(mockCreateURL);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(mockRevokeURL);

    const mockAnchorClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        (el as HTMLAnchorElement).click = mockAnchorClick;
      }
      return el;
    });

    render(<Flyout />);
    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(mockCreateURL).toHaveBeenCalled();
    expect(mockAnchorClick).toHaveBeenCalled();
    expect(mockRevokeURL).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('disappears after unselecting all items', async () => {
    const user = userEvent.setup();
    useSelectionStore.setState({ selectedItems: { 1: rick } });
    render(<Flyout />);
    await user.click(screen.getByRole('button', { name: 'Unselect all' }));
    expect(screen.queryByRole('region', { name: 'selected items' })).not.toBeInTheDocument();
  });
});
