import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchSection from './SearchSection';

describe('SearchSection', () => {
  const onSearch = vi.fn();

  beforeEach(() => {
    onSearch.mockClear();
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

  it('calls onSearch only once even with whitespace variations', async () => {
    const user = userEvent.setup();
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search by character name...');
    await user.type(input, 'rick');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('rick');
  });

  it('does not call onSearch if search term has not changed', async () => {
    const user = userEvent.setup();
    render(<SearchSection initialValue="rick" onSearch={onSearch} />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('calls onSearch with empty string when input is cleared', async () => {
    const user = userEvent.setup();
    render(<SearchSection initialValue="rick" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search by character name...');
    await user.clear(input);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('renders Rick & Morty heading', () => {
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    expect(screen.getByText('Rick & Morty')).toBeInTheDocument();
  });

  it('trims whitespace before calling onSearch', async () => {
    const user = userEvent.setup();
    render(<SearchSection initialValue="" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search by character name...');
    await user.type(input, '   summer   ');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('summer');
  });
});
