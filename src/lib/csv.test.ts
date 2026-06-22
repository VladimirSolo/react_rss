import { describe, it, expect } from 'vitest';
import { charactersToCsv } from './csv';
import { Character } from '../types';

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: '',
};

describe('charactersToCsv', () => {
  it('includes only the header row when there are no items', () => {
    expect(charactersToCsv([])).toBe(
      'ID,Name,Status,Species,Gender,Origin,Location,URL'
    );
  });

  it('renders a row per character', () => {
    const csv = charactersToCsv([rick]);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toBe(
      '1,Rick Sanchez,Alive,Human,Male,Earth (C-137),Citadel of Ricks,https://rickandmortyapi.com/api/character/1'
    );
  });

  it('escapes fields containing commas', () => {
    const withComma: Character = {
      ...rick,
      location: { name: 'Earth, C-137', url: '' },
    };
    expect(charactersToCsv([withComma])).toContain('"Earth, C-137"');
  });

  it('escapes fields containing quotes', () => {
    const withQuote: Character = { ...rick, name: 'Rick "Sanchez"' };
    expect(charactersToCsv([withQuote])).toContain('"Rick ""Sanchez"""');
  });
});
