import { getTranslations } from 'next-intl/server';
import { Link } from '../../i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className="not-found-page">
      <h2>{t('heading')}</h2>
      <p>{t('text')}</p>
      <Link href="/" className="back-link">
        {t('back')}
      </Link>
    </div>
  );
}
