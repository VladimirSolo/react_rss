import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectionStore } from './selectionStore';
import { Character } from '../types';

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

describe('selectionStore', () => {
  it('starts with no selected items', () => {
    expect(useSelectionStore.getState().selectedItems).toEqual({});
  });

  it('toggle adds an item when not selected', () => {
    useSelectionStore.getState().toggle(rick);
    expect(useSelectionStore.getState().selectedItems[1]).toEqual(rick);
  });

  it('toggle removes an item when already selected', () => {
    useSelectionStore.getState().toggle(rick);
    useSelectionStore.getState().toggle(rick);
    expect(useSelectionStore.getState().selectedItems[1]).toBeUndefined();
  });

  it('toggle can manage multiple items independently', () => {
    useSelectionStore.getState().toggle(rick);
    useSelectionStore.getState().toggle(morty);
    const { selectedItems } = useSelectionStore.getState();
    expect(selectedItems[1]).toEqual(rick);
    expect(selectedItems[2]).toEqual(morty);
  });

  it('unselectAll clears all selected items', () => {
    useSelectionStore.getState().toggle(rick);
    useSelectionStore.getState().toggle(morty);
    useSelectionStore.getState().unselectAll();
    expect(useSelectionStore.getState().selectedItems).toEqual({});
  });

  it('unselectAll works when store is already empty', () => {
    useSelectionStore.getState().unselectAll();
    expect(useSelectionStore.getState().selectedItems).toEqual({});
  });
});
