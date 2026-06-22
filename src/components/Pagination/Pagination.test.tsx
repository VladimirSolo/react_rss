import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

type LinkProps = {
  href: string | { pathname: string; query?: Record<string, string> };
  children: ReactNode;
  className?: string;
};

vi.mock('../../i18n/navigation', () => ({
  Link: ({ href, children, className }: LinkProps) => {
    const resolved =
      typeof href === 'string'
        ? href
        : `${href.pathname}?${new URLSearchParams(href.query).toString()}`;
    return (
      <a href={resolved} className={className}>
        {children}
      </a>
    );
  },
}));

interface RenderProps {
  currentPage: number;
  totalPages: number;
  query?: string;
  basePath?: string;
}

async function renderPagination({
  currentPage,
  totalPages,
  query = '',
  basePath = '/',
}: RenderProps) {
  const jsx = await Pagination({ currentPage, totalPages, query, basePath });
  return render(jsx);
}

describe('Pagination', () => {
  it('renders current page and total pages', async () => {
    await renderPagination({ currentPage: 2, totalPages: 5 });
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
  });

  it('renders Prev as a disabled span on first page', async () => {
    await renderPagination({ currentPage: 1, totalPages: 5 });
    const prev = screen.getByText('Prev');
    expect(prev.tagName).toBe('SPAN');
    expect(prev).toHaveClass('pagination-btn--disabled');
  });

  it('renders Next as a disabled span on last page', async () => {
    await renderPagination({ currentPage: 5, totalPages: 5 });
    const next = screen.getByText('Next');
    expect(next.tagName).toBe('SPAN');
    expect(next).toHaveClass('pagination-btn--disabled');
  });

  it('renders both Prev and Next as links on middle pages', async () => {
    await renderPagination({ currentPage: 3, totalPages: 5 });
    expect(screen.getByText('Prev').tagName).toBe('A');
    expect(screen.getByText('Next').tagName).toBe('A');
  });

  it('Prev link points to the previous page', async () => {
    await renderPagination({ currentPage: 3, totalPages: 5 });
    expect(screen.getByText('Prev')).toHaveAttribute(
      'href',
      expect.stringContaining('page=2')
    );
  });

  it('Next link points to the next page', async () => {
    await renderPagination({ currentPage: 3, totalPages: 5 });
    expect(screen.getByText('Next')).toHaveAttribute(
      'href',
      expect.stringContaining('page=4')
    );
  });

  it('preserves query and basePath in pagination links', async () => {
    await renderPagination({
      currentPage: 3,
      totalPages: 5,
      query: 'rick',
      basePath: '/details/7',
    });
    const href = screen.getByText('Next').getAttribute('href');
    expect(href).toContain('/details/7');
    expect(href).toContain('query=rick');
  });
});
