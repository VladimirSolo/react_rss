import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchAction } from './search';

const redirect = vi.fn();

vi.mock('../i18n/navigation', () => ({
  redirect: (...args: unknown[]) => redirect(...args),
}));

describe('searchAction', () => {
  beforeEach(() => {
    redirect.mockClear();
  });

  it('redirects with the trimmed query and resets the page to 1', async () => {
    const formData = new FormData();
    formData.set('query', '  morty  ');

    await searchAction(formData);

    expect(redirect).toHaveBeenCalledWith({
      href: { pathname: '/', query: { query: 'morty', page: '1' } },
      locale: 'en',
    });
  });

  it('omits the query param when the search input is blank', async () => {
    const formData = new FormData();
    formData.set('query', '   ');

    await searchAction(formData);

    expect(redirect).toHaveBeenCalledWith({
      href: { pathname: '/', query: { page: '1' } },
      locale: 'en',
    });
  });

  it('omits the query param when no query field is provided', async () => {
    const formData = new FormData();

    await searchAction(formData);

    expect(redirect).toHaveBeenCalledWith({
      href: { pathname: '/', query: { page: '1' } },
      locale: 'en',
    });
  });
});
