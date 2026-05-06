import { ChangeEvent, Component, ReactNode } from 'react';

const STORAGE_KEY = 'searchTerm';

interface SearchSectionProps {
  initialValue: string;
  onSearch: (term: string) => void;
}

interface SearchSectionState {
  inputValue: string;
  lastSearched: string;
}

class SearchSection extends Component<SearchSectionProps, SearchSectionState> {
  constructor(props: SearchSectionProps) {
    super(props);
    this.state = {
      inputValue: props.initialValue,
      lastSearched: props.initialValue,
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inputValue: event.target.value });
  };

  handleSearch = (): void => {
    const { onSearch } = this.props;
    const { inputValue, lastSearched } = this.state;
    const trimmed = inputValue.trim();

    if (trimmed === lastSearched) return;

    localStorage.setItem(STORAGE_KEY, trimmed);
    this.setState({ inputValue: trimmed, lastSearched: trimmed });
    onSearch(trimmed);
  };

  render(): ReactNode {
    const { inputValue } = this.state;
    return (
      <div className="search-section">
        <h1>Rick &amp; Morty</h1>
        <input
          className="search-input"
          type="text"
          value={inputValue}
          onChange={this.handleChange}
          placeholder="Search by character name..."
        />
        <button
          className="search-btn"
          type="button"
          onClick={this.handleSearch}
        >
          Search
        </button>
      </div>
    );
  }
}

export default SearchSection;
