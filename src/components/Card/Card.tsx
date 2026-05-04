import { Character } from '../../types';

interface CardProps {
  item: Character;
}

function Card({ item }: CardProps): JSX.Element {
  return (
    <div className="card">
      <h3 className="card-name">{item.name}</h3>
      <p className="card-description">
        {item.status} &mdash; {item.species}
      </p>
    </div>
  );
}

export default Card;
