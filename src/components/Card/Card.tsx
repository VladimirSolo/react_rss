import { useNavigate, useSearchParams } from 'react-router-dom';
import { Character } from '../../types';

interface CardProps {
  item: Character;
}

function Card({ item }: CardProps): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '1';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/details/${item.id}?page=${page}`);
  };

  return (
    <div
      className="card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e as unknown as React.MouseEvent)}
    >
      <h3 className="card-name">{item.name}</h3>
      <p className="card-description">
        {item.status} &mdash; {item.species}
      </p>
    </div>
  );
}

export default Card;
