import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';
import { ThemeProvider } from '../../contexts/ThemeProvider';

function renderNav() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </MemoryRouter>
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
