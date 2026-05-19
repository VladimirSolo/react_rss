import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Character } from '../../types';
import Spinner from '../Spinner/Spinner';

const API_BASE = 'https://rickandmortyapi.com/api/character';

export default function DetailPanel(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = searchParams.get('page') ?? '1';

  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        setCharacter(null);

        const res = await fetch(`${API_BASE}/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data: Character = await res.json();
        setCharacter(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [id]);

  const handleClose = (): void => {
    navigate(`/?page=${page}`);
  };

  return (
    <div className="detail-panel">
      <button className="detail-close-btn" type="button" onClick={handleClose}>
        ✕ Close
      </button>

      {isLoading && <Spinner />}

      {error && <div className="error-message">{error}</div>}

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
