import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchSection from './SearchSection';

const searchAction = vi.fn();

vi.mock('../../actions/search', () => ({
  searchAction: (formData: FormData) => searchAction(formData),
}));

async function renderSearchSection(initialQuery = '') {
  const jsx = await SearchSection({ initialQuery });
  return render(jsx);
}

describe('SearchSection', () => {
  beforeEach(() => {
    searchAction.mockClear();
  });

  it('renders search input and search button', async () => {
    await renderSearchSection();
    expect(
      screen.getByPlaceholderText('Search by character name...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('displays initial query in the input', async () => {
    await renderSearchSection('rick');
    expect(screen.getByDisplayValue('rick')).toBeInTheDocument();
  });

  it('shows empty input when initialQuery is empty string', async () => {
    await renderSearchSection('');
    expect(
      screen.getByPlaceholderText('Search by character name...')
    ).toHaveValue('');
  });

  it('renders Rick & Morty heading', async () => {
    await renderSearchSection();
    expect(screen.getByText('Rick & Morty')).toBeInTheDocument();
  });

  it('submits the form through the search server action', async () => {
    const user = userEvent.setup();
    await renderSearchSection();
    await user.type(
      screen.getByPlaceholderText('Search by character name...'),
      'morty'
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(searchAction).toHaveBeenCalledTimes(1);
    const formData = searchAction.mock.calls[0][0] as FormData;
    expect(formData.get('query')).toBe('morty');
  });
});
