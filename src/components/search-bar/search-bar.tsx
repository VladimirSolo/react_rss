import { memo, useEffect, useState } from 'react';
import styles from './search-bar.module.css';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

const DEBOUNCE_MS = 300;

export const SearchBar = memo(({ value, onChange }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => onChange(inputValue), DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [inputValue, onChange]);

  return (
    <div className={styles.container}>
      <label htmlFor="search" className={styles.label}>
        Search countries:
      </label>
      <input
        id="search"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type to search..."
        className={styles.input}
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
