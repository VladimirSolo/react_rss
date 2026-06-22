import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { createTranslator, type AbstractIntlMessages } from 'use-intl/core';
import en from '../messages/en.json';

const messages: AbstractIntlMessages = en;

function resolveNamespace(
  arg?: string | { namespace?: string }
): string | undefined {
  return typeof arg === 'string' ? arg : arg?.namespace;
}

vi.mock('next-intl', async () => {
  const actual = await vi.importActual<typeof import('next-intl')>(
    'next-intl'
  );
  return {
    ...actual,
    useTranslations: (namespace?: string) =>
      createTranslator({ locale: 'en', messages, namespace }),
    useLocale: () => 'en',
  };
});

vi.mock('next-intl/server', () => ({
  getTranslations: async (arg?: string | { namespace?: string }) =>
    createTranslator({ locale: 'en', messages, namespace: resolveNamespace(arg) }),
  getLocale: async () => 'en',
  setRequestLocale: () => {},
}));
