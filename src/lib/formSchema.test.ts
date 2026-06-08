import { describe, it, expect } from 'vitest';
import { createFormSchema } from './formSchema';

const COUNTRIES = ['France', 'Germany', 'United States'];

function makeFileList(files: File[]): FileList {
  const fl: Record<string, unknown> = { length: files.length };
  files.forEach((f, i) => {
    fl[i] = f;
  });
  fl.item = (i: number) => files[i];
  Object.setPrototypeOf(fl, FileList.prototype);
  return fl as unknown as FileList;
}

const validPng = new File(['img'], 'photo.png', { type: 'image/png' });
const validJpeg = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

const validData = {
  name: 'Alice',
  age: '25',
  email: 'alice@example.com',
  gender: 'female' as const,
  termsAccepted: true as const,
  password: 'Secret123!',
  confirmPassword: 'Secret123!',
  country: 'France',
  image: makeFileList([validPng]),
};

describe('createFormSchema', () => {
  const schema = createFormSchema(COUNTRIES);

  it('parses valid data successfully', () => {
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts jpeg images', () => {
    const result = schema.safeParse({
      ...validData,
      image: makeFileList([validJpeg]),
    });
    expect(result.success).toBe(true);
  });

  it('rejects name without uppercase first letter', () => {
    const result = schema.safeParse({ ...validData, name: 'alice' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msg = result.error.issues.find((i) => i.path[0] === 'name');
      expect(msg).toBeDefined();
    }
  });

  it('rejects empty name', () => {
    const result = schema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects negative age', () => {
    const result = schema.safeParse({ ...validData, age: '-1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msg = result.error.issues.find((i) => i.path[0] === 'age');
      expect(msg).toBeDefined();
    }
  });

  it('rejects non-numeric age', () => {
    const result = schema.safeParse({ ...validData, age: 'abc' });
    expect(result.success).toBe(false);
  });

  it('rejects email without @', () => {
    const result = schema.safeParse({
      ...validData,
      email: 'invalidemail.com',
    });
    expect(result.success).toBe(false);
  });

  it('rejects email without domain dot', () => {
    const result = schema.safeParse({ ...validData, email: 'user@domain' });
    expect(result.success).toBe(false);
  });

  it('rejects email with empty local part', () => {
    const result = schema.safeParse({ ...validData, email: '@domain.com' });
    expect(result.success).toBe(false);
  });

  it('rejects missing gender', () => {
    const result = schema.safeParse({ ...validData, gender: '' });
    expect(result.success).toBe(false);
  });

  it('rejects unchecked terms', () => {
    const result = schema.safeParse({
      ...validData,
      termsAccepted: undefined,
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = schema.safeParse({
      ...validData,
      confirmPassword: 'Different1!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msg = result.error.issues.find(
        (i) => i.path[0] === 'confirmPassword'
      );
      expect(msg).toBeDefined();
    }
  });

  it('rejects country not in list', () => {
    const result = schema.safeParse({
      ...validData,
      country: 'Narnia',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty country', () => {
    const result = schema.safeParse({ ...validData, country: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty image FileList', () => {
    const result = schema.safeParse({
      ...validData,
      image: makeFileList([]),
    });
    expect(result.success).toBe(false);
  });

  it('rejects image with wrong mime type', () => {
    const badFile = new File(['data'], 'file.gif', { type: 'image/gif' });
    const result = schema.safeParse({
      ...validData,
      image: makeFileList([badFile]),
    });
    expect(result.success).toBe(false);
  });

  it('rejects image exceeding 2MB', () => {
    const bigContent = new Uint8Array(3 * 1024 * 1024);
    const bigFile = new File([bigContent], 'big.png', { type: 'image/png' });
    const result = schema.safeParse({
      ...validData,
      image: makeFileList([bigFile]),
    });
    expect(result.success).toBe(false);
  });

  it('rejects if image is not a FileList', () => {
    const result = schema.safeParse({ ...validData, image: null });
    expect(result.success).toBe(false);
  });

  it('coerces age string to number on success', () => {
    const result = schema.safeParse({ ...validData, age: '30' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.age).toBe(30);
    }
  });
});
