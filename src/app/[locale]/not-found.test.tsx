import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFound from './not-found';

type LinkProps = {
  href: string | { pathname: string; query?: Record<string, string> };
  children: ReactNode;
  className?: string;
};

vi.mock('../../i18n/navigation', () => ({
  Link: ({ href, children, className }: LinkProps) => (
    <a href={typeof href === 'string' ? href : href.pathname} className={className}>
      {children}
    </a>
  ),
}));

describe('NotFound', () => {
  it('renders 404 heading', async () => {
    render(await NotFound());
    expect(screen.getByText('404 — Page Not Found')).toBeInTheDocument();
  });

  it('renders descriptive message', async () => {
    render(await NotFound());
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();
  });

  it('renders link to return to main page', async () => {
    render(await NotFound());
    expect(
      screen.getByRole('link', { name: /Return to main page/ })
    ).toBeInTheDocument();
  });
});
