import { Component, ReactNode } from 'react';
import { ApiResponse, Character } from '../../types';
import CardList from '../CardList/CardList';
import Spinner from '../Spinner/Spinner';

const API_BASE = 'https://rickandmortyapi.com/api/character';

interface ResultsSectionProps {
  searchTerm: string;
}

interface ResultsSectionState {
  loading: boolean;
  error: string | null;
  items: Character[];
}

class ResultsSection extends Component<ResultsSectionProps, ResultsSectionState> {
  constructor(props: ResultsSectionProps) {
    super(props);
    this.state = { loading: false, error: null, items: [] };
  }

  componentDidMount(): void {
    const { searchTerm } = this.props;
    this.fetchData(searchTerm);
  }

  componentDidUpdate(prevProps: ResultsSectionProps): void {
    const { searchTerm } = this.props;
    if (prevProps.searchTerm !== searchTerm) {
      this.fetchData(searchTerm);
    }
  }

  fetchData = (searchTerm: string): void => {
    const url = searchTerm
      ? `${API_BASE}?name=${encodeURIComponent(searchTerm)}&page=1`
      : `${API_BASE}?page=1`;

    this.setState({ loading: true, error: null, items: [] });

    fetch(url)
      .then((response): Promise<ApiResponse | null> => {
        if (response.status === 404) return Promise.resolve(null);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }
        return response.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        this.setState({ loading: false, items: data ? data.results : [] });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        this.setState({ loading: false, error: message });
      });
  };

  render(): ReactNode {
    const { loading, error, items } = this.state;

    if (loading) return <Spinner />;
    if (error) return <div className="error-message">{error}</div>;
    return <CardList items={items} />;
  }
}

export default ResultsSection;
