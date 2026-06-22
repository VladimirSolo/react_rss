import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCharacters, getCharacter } from './api';

describe('getCharacters', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches characters by page without a query', async () => {
    const mockResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [],
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    } as unknown as Response);

    const data = await getCharacters('', 1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?page=1',
      expect.objectContaining({ next: { revalidate: expect.any(Number) } })
    );
    expect(data).toEqual(mockResponse);
  });

  it('fetches characters by name when a query is provided', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ info: {}, results: [] }),
    } as unknown as Response);

    await getCharacters('rick', 2);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?name=rick&page=2',
      expect.anything()
    );
  });

  it('returns empty results on a 404 response', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 404 } as unknown as Response);

    const data = await getCharacters('zzz', 1);

    expect(data).toEqual({
      results: [],
      info: { count: 0, pages: 0, next: null, prev: null },
    });
  });

  it('throws on other error statuses', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    } as unknown as Response);

    await expect(getCharacters('', 1)).rejects.toThrow('500 Server Error');
  });
});

describe('getCharacter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches a character by id', async () => {
    const character = { id: 1, name: 'Rick' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(character),
    } as unknown as Response);

    const data = await getCharacter('1');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/1',
      expect.anything()
    );
    expect(data).toEqual(character);
  });

  it('returns null on a 404 response', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 404 } as unknown as Response);

    const data = await getCharacter('999');

    expect(data).toBeNull();
  });

  it('throws on other error statuses', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    } as unknown as Response);

    await expect(getCharacter('1')).rejects.toThrow('500 Server Error');
  });
});
