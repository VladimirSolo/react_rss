import { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({
  params,
}: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  return (
    <div className="about-page">
      <h2>{t('heading')}</h2>
      <p>
        {t.rich('intro', {
          link: (chunks: ReactNode) => (
            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      <p>
        <strong>{t('authorLabel')}</strong> Vladimir Solo
      </p>
      <p>
        {t.rich('apiText', {
          link: (chunks: ReactNode) => (
            <a
              href="https://rickandmortyapi.com"
              target="_blank"
              rel="noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      <Link href="/" className="back-link">
        {t('back')}
      </Link>
    </div>
  );
}
