import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal';

const renderModal = (isOpen: boolean, onClose = vi.fn()) =>
  render(
    <Modal isOpen={isOpen} onClose={onClose} title="Test Modal">
      <button type="button">First</button>
      <button type="button">Last</button>
    </Modal>
  );

describe('Modal', () => {
  it('renders nothing when closed', () => {
    renderModal(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog with title when open', () => {
    renderModal(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders children inside the modal', () => {
    renderModal(true);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(true, onClose);
    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(true, onClose);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay background is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(true, onClose);
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(true, onClose);
    await user.click(screen.getByText('Test Modal'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders into document.body via portal', () => {
    const { baseElement } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Portal Test">
        <span>Portal Content</span>
      </Modal>
    );
    expect(baseElement).toContainHTML('Portal Content');
  });

  it('has aria-modal attribute on dialog', () => {
    renderModal(true);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('wraps focus to the first focusable element when Tab is pressed on the last', async () => {
    const user = userEvent.setup();
    renderModal(true);
    const closeBtn = screen.getByRole('button', { name: 'Close modal' });
    const lastBtn = screen.getByRole('button', { name: 'Last' });
    lastBtn.focus();
    await user.tab();
    expect(document.activeElement).toBe(closeBtn);
  });

  it('wraps focus to the last focusable element when Shift+Tab is pressed on the first', async () => {
    const user = userEvent.setup();
    renderModal(true);
    const closeBtn = screen.getByRole('button', { name: 'Close modal' });
    const lastBtn = screen.getByRole('button', { name: 'Last' });
    closeBtn.focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(lastBtn);
  });
});
