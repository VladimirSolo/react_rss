import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getCharacter } from '../../lib/api';
import { Link } from '../../i18n/navigation';
import RefreshButton from '../RefreshButton/RefreshButton';

interface DetailPanelProps {
  id: string;
  page: number;
  query: string;
}

export default async function DetailPanel({
  id,
  page,
  query,
}: DetailPanelProps) {
  const t = await getTranslations('Detail');

  const closeQuery: Record<string, string> = query
    ? { page: String(page), query }
    : { page: String(page) };

  let errorMessage: string | null = null;
  let character: Awaited<ReturnType<typeof getCharacter>> = null;

  try {
    character = await getCharacter(id);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : t('error');
  }

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <Link href={{ pathname: '/', query: closeQuery }} className="detail-close-btn">
          {t('close')}
        </Link>
        <RefreshButton
          label={t('refresh')}
          refreshingLabel={t('refreshing')}
          ariaLabel={t('refresh')}
        />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!errorMessage && !character && (
        <div className="error-message">{t('notFound')}</div>
      )}

      {character && (
        <div className="detail-content">
          <Image
            className="detail-image"
            src={character.image}
            alt={character.name}
            width={300}
            height={300}
          />

          <h2 className="detail-name">{character.name}</h2>

          <ul className="detail-info">
            <li>
              <strong>{t('status')}:</strong> {character.status}
            </li>
            <li>
              <strong>{t('species')}:</strong> {character.species}
            </li>
            <li>
              <strong>{t('gender')}:</strong> {character.gender}
            </li>
            <li>
              <strong>{t('origin')}:</strong> {character.origin.name}
            </li>
            <li>
              <strong>{t('location')}:</strong> {character.location.name}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
