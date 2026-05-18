import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders author information', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Vladimir Solo/)).toBeInTheDocument();
  });

  it('renders RS School React course link', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByText('RS School React course')).toBeInTheDocument();
  });

  it('renders back link to main page', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Back to main page/ })).toBeInTheDocument();
  });

  it('renders Rick & Morty API link', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Rick & Morty API')).toBeInTheDocument();
  });
});
