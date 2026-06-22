import { Character } from '../../types';
import Card from '../Card/Card';

interface CardListProps {
  items: Character[];
}

function CardList({ items }: CardListProps) {
  return (
    <div className="card-list">
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default CardList;
