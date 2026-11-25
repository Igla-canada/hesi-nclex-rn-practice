import { SiteHeader } from "./SiteHeader";

export function PageShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {title ? (
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-[var(--muted)]">{description}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </main>
      <footer className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--muted)]">
        Practice tool only — not affiliated with NCSBN, Elsevier, or HESI. No pass-probability claims.
      </footer>
    </div>
  );
}
