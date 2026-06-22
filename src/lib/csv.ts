import { Character } from '../types';

const HEADERS = [
  'ID',
  'Name',
  'Status',
  'Species',
  'Gender',
  'Origin',
  'Location',
  'URL',
];

function escapeCsvField(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function charactersToCsv(items: Character[]): string {
  const rows = items.map((item) => [
    item.id,
    item.name,
    item.status,
    item.species,
    item.gender,
    item.origin.name,
    item.location.name,
    `https://rickandmortyapi.com/api/character/${item.id}`,
  ]);

  return [HEADERS, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n');
}
