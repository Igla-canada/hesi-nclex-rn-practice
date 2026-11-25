import Link from "next/link";
import { APP_NAME } from "@/lib/exam-config";
import { NAV_ITEMS } from "@/lib/nav";

export function SiteHeader() {
  const primary = NAV_ITEMS.filter((n) =>
    ["/", "/dashboard", "/exams", "/study", "/admin"].includes(n.href),
  );
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
          {APP_NAME}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-1">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
