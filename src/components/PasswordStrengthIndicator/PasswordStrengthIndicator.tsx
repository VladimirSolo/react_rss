import { PasswordStrength } from '../../utils/formUtils';

interface Props {
  strength: PasswordStrength;
}

const STRENGTH_COLOR: Record<PasswordStrength, string> = {
  weak: '#dc3545',
  medium: '#ffc107',
  strong: '#28a745',
};

export default function PasswordStrengthIndicator({ strength }: Props) {
  return (
    <div
      className="password-strength"
      style={{ color: STRENGTH_COLOR[strength] }}
      aria-live="polite"
    >
      Strength:{' '}
      <strong>{strength.charAt(0).toUpperCase() + strength.slice(1)}</strong>
      <span className="password-strength-hint">
        {' '}
        (1 number, 1 uppercase, 1 lowercase, 1 special character)
      </span>
    </div>
  );
}
