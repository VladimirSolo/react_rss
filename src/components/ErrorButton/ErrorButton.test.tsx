import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorButton from './ErrorButton';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const suppressError = (event: ErrorEvent) => event.preventDefault();

describe('ErrorButton', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    window.addEventListener('error', suppressError);
  });

  afterEach(() => {
    window.removeEventListener('error', suppressError);
    vi.restoreAllMocks();
  });

  it('renders the Throw Error button', () => {
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );
    expect(
      screen.getByRole('button', { name: 'Throw Error' })
    ).toBeInTheDocument();
  });

  it('triggers error boundary fallback UI when button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Throw Error' }));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('Test error triggered by user')
    ).toBeInTheDocument();
  });

  it('shows error message with correct text after click', async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Throw Error' }));

    expect(
      screen.queryByRole('button', { name: 'Throw Error' })
    ).not.toBeInTheDocument();
  });
});
