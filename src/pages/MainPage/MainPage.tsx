import { useEffect, useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import SearchSection from '../../components/SearchSection/SearchSection';
import ResultsSection from '../../components/ResultsSection/ResultsSection';
import Modal from '../../components/Modal/Modal';
import UncontrolledForm from '../../components/UncontrolledForm/UncontrolledForm';
import RHFForm from '../../components/RHFForm/RHFForm';
import SubmissionCard from '../../components/SubmissionCard/SubmissionCard';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useFormStore } from '../../store/formStore';

type ActiveForm = 'uncontrolled' | 'rhf' | null;

function MainPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const hasDetail = pathname !== '/';
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  const { submissions } = useFormStore();

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

      <div className="forms-section">
        <div className="forms-buttons">
          <button
            type="button"
            className="form-open-btn"
            onClick={() => setActiveForm('uncontrolled')}
          >
            Uncontrolled Form
          </button>
          <button
            type="button"
            className="form-open-btn form-open-btn--rhf"
            onClick={() => setActiveForm('rhf')}
          >
            React Hook Form
          </button>
        </div>

        {submissions.length > 0 && (
          <div className="submissions-section">
            <h2 className="submissions-title">Submitted Data</h2>
            <div className="submissions-list">
              {submissions.map((s) => (
                <SubmissionCard key={s.id} submission={s} />
              ))}
            </div>
          </div>
        )}
      </div>

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

      <Modal
        isOpen={activeForm === 'uncontrolled'}
        onClose={() => setActiveForm(null)}
        title="Uncontrolled Form"
      >
        <UncontrolledForm onSuccess={() => setActiveForm(null)} />
      </Modal>

      <Modal
        isOpen={activeForm === 'rhf'}
        onClose={() => setActiveForm(null)}
        title="React Hook Form"
      >
        <RHFForm onSuccess={() => setActiveForm(null)} />
      </Modal>
    </>
  );
}

export default MainPage;
