import { setRequestLocale } from 'next-intl/server';
import SearchSection from '../../../../components/SearchSection/SearchSection';
import ResultsList from '../../../../components/ResultsList/ResultsList';
import DetailPanel from '../../../../components/DetailPanel/DetailPanel';

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
};

export default async function DetailsPage({
  params,
  searchParams,
}: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const page = Number(sp.page ?? '1') || 1;
  const query = sp.query ?? '';
  const basePath = `/details/${id}`;

  return (
    <>
      <SearchSection initialQuery={query} />
      <div className="main-content split">
        <section className="list-panel" aria-label="results">
          <ResultsList query={query} page={page} basePath={basePath} />
        </section>
        <DetailPanel id={id} page={page} query={query} />
      </div>
    </>
  );
}
