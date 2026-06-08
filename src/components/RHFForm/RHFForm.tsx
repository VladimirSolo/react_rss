import { useMemo } from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFormSchema, FormValues } from '../../lib/formSchema';
import { getPasswordStrength, imageToBase64 } from '../../utils/formUtils';
import { useFormStore } from '../../store/formStore';
import PasswordStrengthIndicator from '../PasswordStrengthIndicator/PasswordStrengthIndicator';

interface Props {
  onSuccess: () => void;
}

export default function RHFForm({ onSuccess }: Props) {
  const { addSubmission, countries } = useFormStore();
  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password', defaultValue: '' });

  const onSubmit = async (data: FormValues): Promise<void> => {
    const base64 = await imageToBase64(data.image[0]);
    addSubmission({
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      country: data.country,
      image: base64,
    });
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="form-fields"
    >
      <div className="form-group">
        <label htmlFor="rhf-name">Name</label>
        <input id="rhf-name" type="text" {...register('name')} />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-age">Age</label>
        <input id="rhf-age" type="number" min="0" {...register('age')} />
        {errors.age && <p className="form-error">{errors.age.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-email">Email</label>
        <input id="rhf-email" type="email" {...register('email')} />
        {errors.email && (
          <p className="form-error">{errors.email.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-gender">Gender</label>
        <select id="rhf-gender" {...register('gender')}>
          <option value="">-- Select --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="form-error">{errors.gender.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-password">Password</label>
        <input id="rhf-password" type="password" {...register('password')} />
        {password && (
          <PasswordStrengthIndicator strength={getPasswordStrength(password)} />
        )}
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-confirm-password">Confirm Password</label>
        <input
          id="rhf-confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-country">Country</label>
        <input
          id="rhf-country"
          type="text"
          list="rhf-countries-list"
          autoComplete="off"
          {...register('country')}
        />
        <datalist id="rhf-countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && (
          <p className="form-error">{errors.country.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-image">Profile Image (PNG/JPEG, max 2MB)</label>
        <input
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg"
          {...register('image')}
        />
        {errors.image && (
          <p className="form-error">{errors.image.message as string}</p>
        )}
      </div>

      <div className="form-group form-group--checkbox">
        <input
          id="rhf-terms"
          type="checkbox"
          {...register('termsAccepted')}
        />
        <label htmlFor="rhf-terms">I accept Terms &amp; Conditions</label>
        {errors.termsAccepted && (
          <p className="form-error">{errors.termsAccepted.message}</p>
        )}
      </div>

      <button type="submit" className="form-submit-btn" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
