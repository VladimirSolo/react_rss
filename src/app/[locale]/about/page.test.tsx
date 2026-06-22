import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AboutPage from './page';

type LinkProps = {
  href: string | { pathname: string; query?: Record<string, string> };
  children: ReactNode;
  className?: string;
};

vi.mock('../../../i18n/navigation', () => ({
  Link: ({ href, children, className }: LinkProps) => (
    <a href={typeof href === 'string' ? href : href.pathname} className={className}>
      {children}
    </a>
  ),
}));

async function renderAboutPage() {
  const jsx = await AboutPage({ params: Promise.resolve({ locale: 'en' }) });
  return render(jsx);
}

describe('AboutPage', () => {
  it('renders author information', async () => {
    await renderAboutPage();
    expect(screen.getByText(/Vladimir Solo/)).toBeInTheDocument();
  });

  it('renders RS School React course link', async () => {
    await renderAboutPage();
    expect(screen.getByText('RS School React course')).toBeInTheDocument();
  });

  it('renders back link to main page', async () => {
    await renderAboutPage();
    expect(
      screen.getByRole('link', { name: /Back to main page/ })
    ).toBeInTheDocument();
  });

  it('renders Rick & Morty API link', async () => {
    await renderAboutPage();
    expect(screen.getByText('Rick & Morty API')).toBeInTheDocument();
  });
});
