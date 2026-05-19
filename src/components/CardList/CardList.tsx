import { Character } from '../../types';
import Card from '../Card/Card';

interface CardListProps {
  items: Character[];
}

function CardList({ items }: CardListProps): JSX.Element {
  if (items.length === 0) {
    return <p className="no-results">No characters found.</p>;
  }

  return (
    <div className="card-list">
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default CardList;
