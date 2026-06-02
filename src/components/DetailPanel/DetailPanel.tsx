import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCharacterQuery } from '../../hooks/useCharacterQuery';
import Spinner from '../Spinner/Spinner';

export default function DetailPanel(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = searchParams.get('page') ?? '1';

  const { data: character, isLoading, isFetching, error, refresh } =
    useCharacterQuery(id);

  const handleClose = (): void => {
    navigate(`/?page=${page}`);
  };

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <button
          className="detail-close-btn"
          type="button"
          onClick={handleClose}
        >
          ✕ Close
        </button>
        <button
          className="refresh-btn"
          type="button"
          onClick={refresh}
          disabled={isFetching}
          aria-label="Refresh details"
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {isLoading && <Spinner />}

      {error && (
        <div className="error-message">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </div>
      )}

      {character && (
        <div className="detail-content">
          <img
            className="detail-image"
            src={character.image}
            alt={character.name}
          />

          <h2 className="detail-name">{character.name}</h2>

          <ul className="detail-info">
            <li>
              <strong>Status:</strong> {character.status}
            </li>
            <li>
              <strong>Species:</strong> {character.species}
            </li>
            <li>
              <strong>Gender:</strong> {character.gender}
            </li>
            <li>
              <strong>Origin:</strong> {character.origin.name}
            </li>
            <li>
              <strong>Location:</strong> {character.location.name}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
