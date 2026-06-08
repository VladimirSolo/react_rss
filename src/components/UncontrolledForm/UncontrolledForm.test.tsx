import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UncontrolledForm from './UncontrolledForm';

const mockAddSubmission = vi.fn();

vi.mock('../../store/formStore', () => ({
  useFormStore: () => ({
    addSubmission: mockAddSubmission,
    countries: ['France', 'Germany', 'United States'],
  }),
}));

vi.mock('../../utils/formUtils', () => ({
  imageToBase64: vi.fn().mockResolvedValue('data:image/png;base64,test'),
  getPasswordStrength: vi.fn().mockReturnValue('strong'),
}));

describe('UncontrolledForm', () => {
  const onSuccess = vi.fn();

  beforeEach(() => {
    onSuccess.mockClear();
    mockAddSubmission.mockClear();
  });

  it('renders all basic input fields', () => {
    render(<UncontrolledForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
  });

  it('renders password and confirm password fields', () => {
    render(<UncontrolledForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('renders country field with datalist', () => {
    render(<UncontrolledForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    const datalist = document.querySelector('#uc-countries-list');
    expect(datalist).toBeInTheDocument();
    expect(datalist?.querySelectorAll('option').length).toBeGreaterThan(0);
  });

  it('renders image upload field', () => {
    render(<UncontrolledForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText(/Profile Image/i)).toBeInTheDocument();
  });

  it('renders Terms & Conditions checkbox', () => {
    render(<UncontrolledForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText(/accept Terms/i)).toBeInTheDocument();
  });

  it('renders an enabled submit button (no pre-validation)', () => {
    render(<UncontrolledForm onSuccess={onSuccess} />);
    const btn = screen.getByRole('button', { name: 'Submit' });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={onSuccess} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    const errors = await screen.findAllByText(/required/i);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('shows name uppercase error when name starts with lowercase', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText('Name'), 'alice');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText(/uppercase/i)).toBeInTheDocument();
  });

  it('shows password strength indicator when typing in password field', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText('Password'), 'Secret1!');
    expect(screen.getByText(/strength/i)).toBeInTheDocument();
  });

  it('shows terms acceptance error on submit without checking', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={onSuccess} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(
      await screen.findByText(/You must accept Terms/i)
    ).toBeInTheDocument();
  });

  it('does not call addSubmission when form is invalid', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={onSuccess} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(mockAddSubmission).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('all labels are connected to inputs via htmlFor', () => {
    render(<UncontrolledForm onSuccess={onSuccess} />);
    const nameInput = screen.getByLabelText('Name');
    expect(nameInput).toHaveAttribute('id', 'uc-name');
    const ageInput = screen.getByLabelText('Age');
    expect(ageInput).toHaveAttribute('id', 'uc-age');
  });
});
