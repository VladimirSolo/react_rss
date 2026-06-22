'use client';

import { useTransition } from 'react';
import { useRouter } from '../../i18n/navigation';

interface RefreshButtonProps {
  label: string;
  refreshingLabel: string;
  ariaLabel: string;
}

export default function RefreshButton({
  label,
  refreshingLabel,
  ariaLabel,
}: RefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (): void => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      className="refresh-btn"
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={ariaLabel}
    >
      {isPending ? refreshingLabel : label}
    </button>
  );
}
