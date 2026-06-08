import { z } from 'zod';

function isValidEmail(value: string): boolean {
  const parts = value.split('@');
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || !domain) return false;

  return domain.includes('.');
}

const imageSchema = z
  .custom<FileList>((value) => value instanceof FileList, {
    message: 'Image is required',
  })
  .refine((fileList) => fileList.length > 0, { message: 'Image is required' })
  .refine(
    (fileList) => ['image/png', 'image/jpeg'].includes(fileList[0]?.type ?? ''),
    { message: 'Only PNG and JPEG are allowed' }
  )
  .refine((fileList) => (fileList[0]?.size ?? Infinity) <= 2 * 1024 * 1024, {
    message: 'Max file size is 2MB',
  });

export function createFormSchema(countries: string[]) {
  return z
    .object({
      name: z
        .string()
        .min(1, { message: 'Name is required' })
        .refine((v) => /^[A-Z]/.test(v), {
          message: 'First letter must be uppercase',
        }),
      age: z.coerce
        .number({ message: 'Age must be a number' })
        .nonnegative({ message: 'Age must not be negative' })
        .int({ message: 'Age must be an integer' }),
      email: z
        .string()
        .min(1, { message: 'Email is required' })
        .refine(isValidEmail, { message: 'Invalid email address' }),
      gender: z.enum(['male', 'female', 'other'], {
        message: 'Please select a gender',
      }),
      termsAccepted: z.literal(true, {
        message: 'You must accept Terms & Conditions',
      }),
      password: z.string().min(1, { message: 'Password is required' }),
      confirmPassword: z
        .string()
        .min(1, { message: 'Confirm password is required' }),
      country: z
        .string()
        .min(1, { message: 'Country is required' })
        .refine((v) => countries.includes(v), {
          message: 'Country must be selected from the list',
        }),
      image: imageSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
}

export type FormValues = {
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  termsAccepted: true;
  password: string;
  confirmPassword: string;
  country: string;
  image: FileList;
};
