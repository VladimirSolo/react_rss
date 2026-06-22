'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

interface ErrorBoundaryBaseProps {
  children: ReactNode;
  heading: string;
  fallbackMessage: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundaryBase extends Component<
  ErrorBoundaryBaseProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryBaseProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render(): ReactNode {
    const { hasError, errorMessage } = this.state;
    const { children, heading, fallbackMessage } = this.props;

    if (hasError) {
      return (
        <div className="error-boundary-fallback">
          <h2>{heading}</h2>
          <p>{errorMessage || fallbackMessage}</p>
        </div>
      );
    }

    return children;
  }
}

function ErrorBoundary({ children }: { children: ReactNode }) {
  const t = useTranslations('ErrorBoundary');

  return (
    <ErrorBoundaryBase heading={t('heading')} fallbackMessage={t('fallback')}>
      {children}
    </ErrorBoundaryBase>
  );
}

export default ErrorBoundary;
