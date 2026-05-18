import { useState } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    if (item === null) return initialValue;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  });

  const setValue = (value: T): void => {
    setStoredValue(value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      localStorage.setItem(key, String(value));
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
