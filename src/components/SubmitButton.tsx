"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={className}>
      {children}
      {pending ? <span className="mt-2 block text-xs text-[var(--muted)]">Starting session…</span> : null}
    </button>
  );
}
