import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Navigation from './Navigation';
import { ThemeProvider } from '../../contexts/ThemeProvider';

type LinkProps = {
  href: string | { pathname: string; query?: Record<string, string> };
  children: ReactNode;
  className?: string;
};

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('../../i18n/navigation', () => ({
  Link: ({ href, children, className }: LinkProps) => (
    <a href={typeof href === 'string' ? href : href.pathname} className={className}>
      {children}
    </a>
  ),
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
}));

function renderNav() {
  return render(
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}

describe('Navigation', () => {
  it('renders Home link', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders About link', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('About link points to /about', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
  });

  it('renders the locale switcher', () => {
    renderNav();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Русский' })).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderNav();
    expect(
      screen.getByRole('button', { name: 'Dark mode' })
    ).toBeInTheDocument();
  });

  it('toggles theme label when button is clicked', async () => {
    const user = userEvent.setup();
    renderNav();
    const btn = screen.getByRole('button', { name: 'Dark mode' });
    await user.click(btn);
    expect(
      screen.getByRole('button', { name: 'Light mode' })
    ).toBeInTheDocument();
  });
});
