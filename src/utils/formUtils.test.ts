import { describe, it, expect, vi, afterEach } from 'vitest';
import { getPasswordStrength, imageToBase64 } from './formUtils';

describe('getPasswordStrength', () => {
  it('returns weak for password with only lowercase letters', () => {
    expect(getPasswordStrength('abcdef')).toBe('weak');
  });

  it('returns weak for password with only one criterion', () => {
    expect(getPasswordStrength('ABCDEF')).toBe('weak');
  });

  it('returns medium for password with two criteria', () => {
    expect(getPasswordStrength('abcABC')).toBe('medium');
  });

  it('returns medium for password with exactly 2 criteria', () => {
    expect(getPasswordStrength('abc123')).toBe('medium');
  });

  it('returns strong for password with 3 criteria', () => {
    expect(getPasswordStrength('abcABC1')).toBe('strong');
  });

  it('returns strong for password with all 4 criteria', () => {
    expect(getPasswordStrength('abcABC1!')).toBe('strong');
  });

  it('detects numbers and improves score above weak', () => {
    expect(getPasswordStrength('abc1')).toBe('medium');
  });

  it('detects special characters and improves score above weak', () => {
    expect(getPasswordStrength('abc!')).toBe('medium');
  });
});

describe('imageToBase64', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves with the data URL from FileReader', async () => {
    const mockDataUrl = 'data:image/png;base64,dGVzdA==';

    class MockFileReader {
      result = mockDataUrl;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL = vi.fn(() => {
        this.onload?.();
      });
    }

    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File(['data'], 'test.png', { type: 'image/png' });
    const result = await imageToBase64(file);
    expect(result).toBe(mockDataUrl);
  });

  it('rejects when FileReader fires an error', async () => {
    class MockFileReaderError {
      result: null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL = vi.fn(() => {
        this.onerror?.();
      });
    }

    vi.stubGlobal('FileReader', MockFileReaderError);

    const file = new File(['data'], 'test.png', { type: 'image/png' });
    await expect(imageToBase64(file)).rejects.toThrow('Failed to read file');
  });
});
