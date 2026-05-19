import { useEffect } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import SearchSection from '../../components/SearchSection/SearchSection';
import ResultsSection from '../../components/ResultsSection/ResultsSection';
import useLocalStorage from '../../hooks/useLocalStorage';

function MainPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const hasDetail = pathname !== '/';

  useEffect(() => {
    if (!searchParams.get('page')) {
      navigate('/?page=1', { replace: true });
    }
  }, [navigate, searchParams]);

  const handleSearch = (term: string): void => {
    setSearchTerm(term);
    navigate('/?page=1');
  };

  const handleCloseDetail = (): void => {
    if (hasDetail) {
      const page = searchParams.get('page') ?? '1';
      navigate(`/?page=${page}`);
    }
  };

  return (
    <>
      <SearchSection initialValue={searchTerm} onSearch={handleSearch} />
      <div className={`main-content${hasDetail ? ' split' : ''}`}>
        <section
          className="list-panel"
          onClick={handleCloseDetail}
          aria-label="results"
        >
          <ResultsSection searchTerm={searchTerm} />
        </section>
        <Outlet />
      </div>
    </>
  );
}

export default MainPage;
