import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import { ThemeProvider } from '../../contexts/ThemeProvider';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import ErrorButton from '../../components/ErrorButton/ErrorButton';
import Navigation from '../../components/Navigation/Navigation';
import Flyout from '../../components/Flyout/Flyout';
import '../globals.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { title: t('title'), description: t('description') };
}

export default async function LocaleLayout({
  children,
  params,
}: Props): Promise<ReactNode> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider>
            <div className="app">
              <ErrorBoundary>
                <Navigation />
                {children}
                <div className="footer-area">
                  <ErrorButton />
                </div>
              </ErrorBoundary>
              <Flyout />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
