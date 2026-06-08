import { useRef, useState, useMemo } from 'react';
import { ZodError } from 'zod';
import { createFormSchema } from '../../lib/formSchema';
import { getPasswordStrength, imageToBase64 } from '../../utils/formUtils';
import { useFormStore } from '../../store/formStore';
import PasswordStrengthIndicator from '../PasswordStrengthIndicator/PasswordStrengthIndicator';
import { PasswordStrength } from '../../utils/formUtils';

interface Props {
  onSuccess: () => void;
}

export default function UncontrolledForm({ onSuccess }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength | null>(null);

  const { addSubmission, countries } = useFormStore();
  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current!;
    const formData = new FormData(form);

    const rawData = {
      name: formData.get('name') as string,
      age: formData.get('age') as string,
      email: formData.get('email') as string,
      gender: formData.get('gender') as string,
      termsAccepted:
        formData.get('termsAccepted') === 'on' ? (true as const) : undefined,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      country: formData.get('country') as string,
      image: imageRef.current?.files,
    };

    try {
      const validated = schema.parse(rawData);
      const base64 = await imageToBase64(validated.image[0]);

      addSubmission({
        name: validated.name,
        age: validated.age,
        email: validated.email,
        gender: validated.gender,
        country: validated.country,
        image: base64,
      });
      setErrors({});
      onSuccess();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const key = issue.path.join('.');
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="form-fields"
    >
      <div className="form-group">
        <label htmlFor="uc-name">Name</label>
        <input id="uc-name" name="name" type="text" />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="uc-age">Age</label>
        <input id="uc-age" name="age" type="number" min="0" />
        {errors.age && <p className="form-error">{errors.age}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="uc-email">Email</label>
        <input id="uc-email" name="email" type="email" />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="uc-gender">Gender</label>
        <select id="uc-gender" name="gender">
          <option value="">-- Select --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="form-error">{errors.gender}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="uc-password">Password</label>
        <input
          id="uc-password"
          name="password"
          type="password"
          onChange={(e) =>
            setPasswordStrength(getPasswordStrength(e.target.value))
          }
        />
        {passwordStrength && (
          <PasswordStrengthIndicator strength={passwordStrength} />
        )}
        {errors.password && <p className="form-error">{errors.password}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="uc-confirm-password">Confirm Password</label>
        <input
          id="uc-confirm-password"
          name="confirmPassword"
          type="password"
        />
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="uc-country">Country</label>
        <input
          id="uc-country"
          name="country"
          type="text"
          list="uc-countries-list"
          autoComplete="off"
        />
        <datalist id="uc-countries-list">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        {errors.country && <p className="form-error">{errors.country}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="uc-image">Profile Image (PNG/JPEG, max 2MB)</label>
        <input
          id="uc-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          ref={imageRef}
        />
        {errors.image && <p className="form-error">{errors.image}</p>}
      </div>

      <div className="form-group form-group--checkbox">
        <input id="uc-terms" name="termsAccepted" type="checkbox" />
        <label htmlFor="uc-terms">I accept Terms &amp; Conditions</label>
        {errors.termsAccepted && (
          <p className="form-error">{errors.termsAccepted}</p>
        )}
      </div>

      <button type="submit" className="form-submit-btn">
        Submit
      </button>
    </form>
  );
}
