import { setRequestLocale } from 'next-intl/server';
import SearchSection from '../../components/SearchSection/SearchSection';
import ResultsList from '../../components/ResultsList/ResultsList';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
};

export default async function HomePage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const page = Number(sp.page ?? '1') || 1;
  const query = sp.query ?? '';

  return (
    <>
      <SearchSection initialQuery={query} />
      <div className="main-content">
        <section className="list-panel" aria-label="results">
          <ResultsList query={query} page={page} basePath="/" />
        </section>
      </div>
    </>
  );
}
