import { ChangeEvent, useState } from 'react';

interface SearchSectionProps {
  initialValue: string;
  onSearch: (term: string) => void;
}

function SearchSection({
  initialValue,
  onSearch,
}: SearchSectionProps): JSX.Element {
  const [inputValue, setInputValue] = useState(initialValue);
  const [lastSearched, setLastSearched] = useState(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  const handleSearch = (): void => {
    const trimmed = inputValue.trim();
    if (trimmed === lastSearched) return;
    setLastSearched(trimmed);
    onSearch(trimmed);
  };

  return (
    <div className="search-section">
      <h1>Rick &amp; Morty</h1>
      <input
        className="search-input"
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search by character name..."
      />
      <button className="search-btn" type="button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchSection;
