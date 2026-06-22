import { NextRequest } from 'next/server';
import { getCharacter } from '../../../lib/api';
import { charactersToCsv } from '../../../lib/csv';
import { Character } from '../../../types';

export async function GET(request: NextRequest): Promise<Response> {
  const idsParam = request.nextUrl.searchParams.get('ids') ?? '';
  const ids = idsParam
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return new Response('No character ids provided', { status: 400 });
  }

  const characters = (
    await Promise.all(ids.map((id) => getCharacter(id)))
  ).filter((item): item is Character => item !== null);

  const csv = charactersToCsv(characters);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${characters.length}_items.csv"`,
    },
  });
}
