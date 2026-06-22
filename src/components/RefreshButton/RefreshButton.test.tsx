import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RefreshButton from './RefreshButton';

const refresh = vi.fn();

vi.mock('../../i18n/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

describe('RefreshButton', () => {
  it('renders the label', () => {
    render(
      <RefreshButton label="Refresh" refreshingLabel="Refreshing…" ariaLabel="Refresh" />
    );
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  it('calls router.refresh when clicked', async () => {
    const user = userEvent.setup();
    render(
      <RefreshButton label="Refresh" refreshingLabel="Refreshing…" ariaLabel="Refresh" />
    );
    await user.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
