import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SubmissionCard from './SubmissionCard';
import { FormSubmission } from '../../types';

const baseSubmission: FormSubmission = {
  id: '1',
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  gender: 'female',
  country: 'France',
  image: 'data:image/png;base64,abc',
  submittedAt: Date.now(),
};

describe('SubmissionCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the submission name', () => {
    render(<SubmissionCard submission={baseSubmission} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders age, email, gender, and country', () => {
    render(<SubmissionCard submission={baseSubmission} />);
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('female')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
  });

  it('renders the avatar image with alt text', () => {
    render(<SubmissionCard submission={baseSubmission} />);
    const img = screen.getByRole('img', { name: "Alice's avatar" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc');
  });

  it('does not render image element when image is empty', () => {
    render(
      <SubmissionCard
        submission={{ ...baseSubmission, image: '' }}
      />
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies new highlight class for recently submitted cards', () => {
    render(<SubmissionCard submission={baseSubmission} />);
    const card = screen.getByTestId('submission-card');
    expect(card).toHaveClass('submission-card--new');
  });

  it('removes highlight class immediately for old submissions', () => {
    const oldSubmission: FormSubmission = {
      ...baseSubmission,
      submittedAt: Date.now() - 10_000,
    };
    render(<SubmissionCard submission={oldSubmission} />);
    const card = screen.getByTestId('submission-card');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(card).not.toHaveClass('submission-card--new');
  });

  it('removes new highlight after 3 seconds', () => {
    render(<SubmissionCard submission={baseSubmission} />);
    const card = screen.getByTestId('submission-card');
    expect(card).toHaveClass('submission-card--new');
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(card).not.toHaveClass('submission-card--new');
  });
});
