import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LocaleSwitcher from './LocaleSwitcher';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=2'),
}));

vi.mock('../../i18n/navigation', () => ({
  usePathname: () => '/details/5',
  useRouter: () => ({ replace }),
}));

describe('LocaleSwitcher', () => {
  it('renders a button for each configured locale', () => {
    render(<LocaleSwitcher />);
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Русский' })).toBeInTheDocument();
  });

  it('marks the current locale as active', () => {
    render(<LocaleSwitcher />);
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Русский' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('switches locale while preserving the current path and query', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);
    await user.click(screen.getByRole('button', { name: 'Русский' }));
    expect(replace).toHaveBeenCalledWith('/details/5?page=2', { locale: 'ru' });
  });
});
