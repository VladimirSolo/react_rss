import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  it('displays Weak for weak strength', () => {
    render(<PasswordStrengthIndicator strength="weak" />);
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('displays Medium for medium strength', () => {
    render(<PasswordStrengthIndicator strength="medium" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('displays Strong for strong strength', () => {
    render(<PasswordStrengthIndicator strength="strong" />);
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen readers', () => {
    const { container } = render(
      <PasswordStrengthIndicator strength="weak" />
    );
    expect(container.firstChild).toHaveAttribute('aria-live', 'polite');
  });

  it('uses red color for weak password', () => {
    const { container } = render(
      <PasswordStrengthIndicator strength="weak" />
    );
    expect(container.firstChild).toHaveStyle({ color: '#dc3545' });
  });

  it('uses yellow color for medium password', () => {
    const { container } = render(
      <PasswordStrengthIndicator strength="medium" />
    );
    expect(container.firstChild).toHaveStyle({ color: '#ffc107' });
  });

  it('uses green color for strong password', () => {
    const { container } = render(
      <PasswordStrengthIndicator strength="strong" />
    );
    expect(container.firstChild).toHaveStyle({ color: '#28a745' });
  });

  it('shows hint text about criteria', () => {
    render(<PasswordStrengthIndicator strength="weak" />);
    expect(
      screen.getByText(/1 number, 1 uppercase, 1 lowercase, 1 special character/)
    ).toBeInTheDocument();
  });
});
