import { Component, ReactNode } from 'react';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import SearchSection from './components/SearchSection/SearchSection';
import ResultsSection from './components/ResultsSection/ResultsSection';
import ErrorButton from './components/ErrorButton/ErrorButton';
import './App.css';

const STORAGE_KEY = 'searchTerm';

interface AppState {
  searchTerm: string;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem(STORAGE_KEY) ?? '',
    };
  }

  handleSearch = (term: string): void => {
    this.setState({ searchTerm: term });
  };

  render(): ReactNode {
    const { searchTerm } = this.state;

    return (
      <div className="app">
        <ErrorBoundary>
          <SearchSection
            initialValue={searchTerm}
            onSearch={this.handleSearch}
          />
          <main className="results-section">
            <ResultsSection searchTerm={searchTerm} />
          </main>
          <div className="footer-area">
            <ErrorButton />
          </div>
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
