import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchSection from './SearchSection';

const STORAGE_KEY = 'searchTerm';

describe('SearchSection', () => {
  const onSearch = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    onSearch.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders search input and search button', () => {
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    expect(screen.getByPlaceholderText('Search by character name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('displays initial value in input from props', () => {
    render(<SearchSection initialValue="rick" onSearch={onSearch} />);
    expect(screen.getByDisplayValue('rick')).toBeInTheDocument();
  });

  it('shows empty input when initialValue is empty string', () => {
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    expect(screen.getByPlaceholderText('Search by character name...')).toHaveValue('');
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search by character name...');
    await user.type(input, 'morty');
    expect(input).toHaveValue('morty');
  });

  it('calls onSearch callback with trimmed value when button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search by character name...');
    await user.type(input, '  morty  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('morty');
  });

  it('saves trimmed search term to localStorage when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search by character name...');
    await user.type(input, 'rick');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(localStorage.getItem(STORAGE_KEY)).toBe('rick');
  });

  it('overwrites existing localStorage value with new search term', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, 'old-value');
    render(<SearchSection initialValue="old-value" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search by character name...');
    await user.clear(input);
    await user.type(input, 'new-value');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(localStorage.getItem(STORAGE_KEY)).toBe('new-value');
  });

  it('does not call onSearch if search term has not changed', async () => {
    const user = userEvent.setup();
    render(<SearchSection initialValue="rick" onSearch={onSearch} />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('trims whitespace from search input before saving to localStorage', async () => {
    const user = userEvent.setup();
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search by character name...');
    await user.type(input, '   summer   ');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(localStorage.getItem(STORAGE_KEY)).toBe('summer');
  });

  it('renders Rick & Morty heading', () => {
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    expect(screen.getByText('Rick & Morty')).toBeInTheDocument();
  });
});
