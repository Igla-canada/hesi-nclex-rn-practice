import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { APP_NAME } from "@/lib/exam-config";
import { NAV_ITEMS } from "@/lib/nav";

export default function HomePage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-14 sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(135deg, color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%), linear-gradient(0deg, transparent 60%, color-mix(in oklab, var(--chart) 12%, transparent))",
          }}
        />
        <div className="relative max-w-2xl">
          <p className="font-display text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            Nursing education practice
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {APP_NAME}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Timed exam simulations, study mode, and answer review with
            server-side scoring. Example items only until clinically verified.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/exams"
              className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Start an exam
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)]"
            >
              Student dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">Site map</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm hover:border-[var(--accent)]"
              >
                <span className="font-medium">{item.label}</span>
                <span className="mt-0.5 block text-xs uppercase tracking-wide text-[var(--muted)]">
                  {item.group}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
