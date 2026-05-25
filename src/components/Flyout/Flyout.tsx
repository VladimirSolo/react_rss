import { useSelectionStore } from '../../store/selectionStore';
import { Character } from '../../types';

function generateCSV(items: Character[]): string {
  const headers = [
    'ID',
    'Name',
    'Status',
    'Species',
    'Gender',
    'Origin',
    'Location',
    'URL',
  ];
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
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}

export default function Flyout(): JSX.Element | null {
  const { selectedItems, unselectAll } = useSelectionStore();
  const items = Object.values(selectedItems);
  const count = items.length;

  if (count === 0) return null;

  const handleDownload = (): void => {
    const csv = generateCSV(items);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${count}_items.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flyout" role="region" aria-label="selected items">
      <span className="flyout-count">
        {count} item{count !== 1 ? 's' : ''} selected
      </span>
      <button className="flyout-btn" type="button" onClick={unselectAll}>
        Unselect all
      </button>
      <button
        className="flyout-btn flyout-btn--download"
        type="button"
        onClick={handleDownload}
      >
        Download
      </button>
    </div>
  );
}
