'use server';

import { getLocale } from 'next-intl/server';
import { redirect } from '../i18n/navigation';

export async function searchAction(formData: FormData): Promise<void> {
  const locale = await getLocale();
  const trimmed = String(formData.get('query') ?? '').trim();

  redirect({
    href: {
      pathname: '/',
      query: trimmed ? { query: trimmed, page: '1' } : { page: '1' },
    },
    locale,
  });
}
