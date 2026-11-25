import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { CLIENT_NEEDS_2026 } from "@/lib/blueprint";
import { PRACTICE_BENCHMARK_PERCENT } from "@/lib/exam-config";

export const metadata = { title: "Student dashboard" };

/** Placeholder chart data until attempts exist in DB */
const DEMO_ACCURACY = [
  { label: "Attempt 1", accuracy: 72 },
  { label: "Attempt 2", accuracy: 78 },
  { label: "Attempt 3", accuracy: 81 },
];

export default function DashboardPage() {
  const max = 100;
  return (
    <PageShell
      title="Student dashboard"
      description={`Track practice accuracy vs the ${PRACTICE_BENCHMARK_PERCENT}% benchmark. Points and accuracy stay separate for NGN partial credit. No pass-probability claims.`}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-display text-lg font-semibold">Recent accuracy</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Demo bars until real attempts are stored — not predictive of NCLEX/HESI.
          </p>
          <ul className="mt-4 space-y-3" aria-label="Accuracy chart">
            {DEMO_ACCURACY.map((row) => (
              <li key={row.label}>
                <div className="flex justify-between text-sm">
                  <span>{row.label}</span>
                  <span className="tabular-nums">{row.accuracy}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-[var(--surface-2)]">
                  <div
                    className="h-2 rounded-full bg-[var(--chart)]"
                    style={{ width: `${(row.accuracy / max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
            <li className="pt-2 text-xs text-[var(--muted)]">
              Benchmark line: {PRACTICE_BENCHMARK_PERCENT}%
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-display text-lg font-semibold">Client Needs focus</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {CLIENT_NEEDS_2026.map((c) => (
              <li key={c.id} className="flex justify-between gap-2 border-b border-[var(--border)] py-1.5">
                <span>{c.label}</span>
                <span className="shrink-0 tabular-nums text-[var(--muted)]">
                  {c.minPercent}–{c.maxPercent}%
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/practice"
            className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Start custom practice →
          </Link>
        </section>
      </div>
    </PageShell>
  );
}
