import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { Character } from '../../../types';

const getCharacter = vi.fn();

vi.mock('../../../lib/api', () => ({
  getCharacter: (id: string) => getCharacter(id),
}));

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

const morty: Character = { ...rick, id: 2, name: 'Morty Smith' };

describe('GET /api/csv', () => {
  beforeEach(() => {
    getCharacter.mockReset();
  });

  it('returns 400 when no ids are provided', async () => {
    const req = new NextRequest('http://localhost/api/csv');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('returns a CSV file with the requested characters', async () => {
    getCharacter.mockImplementation((id: string) =>
      Promise.resolve(id === '1' ? rick : morty)
    );

    const req = new NextRequest('http://localhost/api/csv?ids=1,2');
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
    expect(res.headers.get('content-disposition')).toBe(
      'attachment; filename="2_items.csv"'
    );

    const text = await res.text();
    expect(text).toContain('Rick Sanchez');
    expect(text).toContain('Morty Smith');
  });

  it('skips ids that are not found', async () => {
    getCharacter.mockImplementation((id: string) =>
      Promise.resolve(id === '1' ? rick : null)
    );

    const req = new NextRequest('http://localhost/api/csv?ids=1,999');
    const res = await GET(req);

    const text = await res.text();
    expect(text.split('\n')).toHaveLength(2);
  });
});
