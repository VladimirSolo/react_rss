import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

function BrokenChild() {
  throw new Error('Test error from child');
}

function GoodChild() {
  return <div>Good content</div>;
}

const suppressError = (event: ErrorEvent) => event.preventDefault();

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    window.addEventListener('error', suppressError);
  });

  afterEach(() => {
    window.removeEventListener('error', suppressError);
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Good content')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('displays error message in fallback UI', () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Test error from child')).toBeInTheDocument();
  });

  it('calls console.error when error occurs', () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalled();
  });

  it('does not show fallback UI when no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('shows fallback with generic message for errors without message', () => {
    function NoMessageError() {
      throw new Error('');
    }
    render(
      <ErrorBoundary>
        <NoMessageError />
      </ErrorBoundary>
    );
    expect(
      screen.getByText('An unexpected error occurred.')
    ).toBeInTheDocument();
  });
});
