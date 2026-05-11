import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders spinner container', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('renders inner spinner ring', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.spinner-ring')).toBeInTheDocument();
  });

  it('is visible in the document', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeVisible();
  });
});
