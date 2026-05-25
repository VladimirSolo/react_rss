import { useNavigate, useSearchParams } from 'react-router-dom';
import { Character } from '../../types';
import { useSelectionStore } from '../../store/selectionStore';

interface CardProps {
  item: Character;
}

function Card({ item }: CardProps): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const { selectedItems, toggle } = useSelectionStore();
  const isSelected = Boolean(selectedItems[item.id]);

  const handleCardClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    navigate(`/details/${item.id}?page=${page}`);
  };

  const handleCheckboxClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  const handleCheckboxChange = (): void => {
    toggle(item);
  };

  return (
    <div
      className={`card${isSelected ? ' card--selected' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === 'Enter' && handleCardClick(e as unknown as React.MouseEvent)
      }
    >
      <input
        type="checkbox"
        className="card-checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        onClick={handleCheckboxClick}
        aria-label={`Select ${item.name}`}
      />
      <h3 className="card-name">{item.name}</h3>
      <p className="card-description">
        {item.status} &mdash; {item.species}
      </p>
    </div>
  );
}

export default Card;
