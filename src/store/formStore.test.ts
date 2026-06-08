import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from './formStore';

beforeEach(() => {
  useFormStore.setState({ submissions: [] });
});

describe('formStore', () => {
  it('starts with an empty submissions list', () => {
    expect(useFormStore.getState().submissions).toEqual([]);
  });

  it('has a non-empty countries list', () => {
    expect(useFormStore.getState().countries.length).toBeGreaterThan(0);
  });

  it('countries list contains well-known entries', () => {
    const { countries } = useFormStore.getState();
    expect(countries).toContain('France');
    expect(countries).toContain('Germany');
    expect(countries).toContain('United States');
  });

  it('addSubmission appends a new entry with id and submittedAt', () => {
    useFormStore.getState().addSubmission({
      name: 'Alice',
      age: 25,
      email: 'alice@example.com',
      gender: 'female',
      country: 'France',
      image: 'data:image/png;base64,abc',
    });

    const { submissions } = useFormStore.getState();
    expect(submissions).toHaveLength(1);
    expect(submissions[0].name).toBe('Alice');
    expect(submissions[0].id).toBeDefined();
    expect(submissions[0].submittedAt).toBeGreaterThan(0);
  });

  it('addSubmission accumulates multiple entries', () => {
    useFormStore.getState().addSubmission({
      name: 'Alice',
      age: 25,
      email: 'alice@example.com',
      gender: 'female',
      country: 'France',
      image: '',
    });
    useFormStore.getState().addSubmission({
      name: 'Bob',
      age: 30,
      email: 'bob@example.com',
      gender: 'male',
      country: 'Germany',
      image: '',
    });

    expect(useFormStore.getState().submissions).toHaveLength(2);
    expect(useFormStore.getState().submissions[1].name).toBe('Bob');
  });

  it('each submission gets a unique id', () => {
    useFormStore.getState().addSubmission({
      name: 'Alice',
      age: 25,
      email: 'alice@example.com',
      gender: 'female',
      country: 'France',
      image: '',
    });
    useFormStore.getState().addSubmission({
      name: 'Bob',
      age: 30,
      email: 'bob@example.com',
      gender: 'male',
      country: 'Germany',
      image: '',
    });

    const { submissions } = useFormStore.getState();
    expect(submissions[0].id).not.toBe(submissions[1].id);
  });
});
