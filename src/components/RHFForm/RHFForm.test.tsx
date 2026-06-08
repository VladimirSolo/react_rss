import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RHFForm from './RHFForm';

vi.mock('../../store/formStore', () => ({
  useFormStore: () => ({
    addSubmission: vi.fn(),
    countries: ['France', 'Germany', 'United States'],
  }),
}));

vi.mock('../../utils/formUtils', () => ({
  imageToBase64: vi.fn().mockResolvedValue('data:image/png;base64,test'),
  getPasswordStrength: vi.fn().mockReturnValue('strong'),
}));

describe('RHFForm', () => {
  const onSuccess = vi.fn();

  beforeEach(() => {
    onSuccess.mockClear();
  });

  it('renders all basic input fields', () => {
    render(<RHFForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
  });

  it('renders password fields', () => {
    render(<RHFForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('renders country and image fields', () => {
    render(<RHFForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Profile Image/i)
    ).toBeInTheDocument();
  });

  it('renders Terms & Conditions checkbox', () => {
    render(<RHFForm onSuccess={onSuccess} />);
    expect(
      screen.getByLabelText(/accept Terms/i)
    ).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<RHFForm onSuccess={onSuccess} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submit button is disabled when form is empty', () => {
    render(<RHFForm onSuccess={onSuccess} />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('shows password strength indicator when password is typed', async () => {
    const user = userEvent.setup();
    render(<RHFForm onSuccess={onSuccess} />);
    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, 'Secret1!');
    expect(screen.getByText(/strength/i)).toBeInTheDocument();
  });

  it('shows name error when name starts with lowercase', async () => {
    const user = userEvent.setup();
    render(<RHFForm onSuccess={onSuccess} />);
    const nameInput = screen.getByLabelText('Name');
    await user.type(nameInput, 'alice');
    await user.tab();
    expect(
      await screen.findByText(/uppercase/i)
    ).toBeInTheDocument();
  });

  it('shows email error for invalid email', async () => {
    const user = userEvent.setup();
    render(<RHFForm onSuccess={onSuccess} />);
    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'notanemail');
    await user.tab();
    expect(
      await screen.findByText(/invalid email/i)
    ).toBeInTheDocument();
  });

  it('shows country error when country is not in the list', async () => {
    const user = userEvent.setup();
    render(<RHFForm onSuccess={onSuccess} />);
    const countryInput = screen.getByLabelText('Country');
    await user.type(countryInput, 'Narnia');
    await user.tab();
    expect(
      await screen.findByText(/selected from the list/i)
    ).toBeInTheDocument();
  });

  it('countries are available in the datalist', () => {
    render(<RHFForm onSuccess={onSuccess} />);
    const datalist = document.querySelector('#rhf-countries-list');
    expect(datalist).toBeInTheDocument();
    expect(datalist?.querySelectorAll('option').length).toBeGreaterThan(0);
  });
});
