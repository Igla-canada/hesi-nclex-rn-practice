import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import {
  CLIENT_NEEDS_2026,
  allocateBlueprintQuotas,
  NCLEX_MAX_ITEMS,
  NCLEX_MIN_ITEMS,
  NCLEX_TIME_HOURS,
} from "@/lib/blueprint";
import {
  EXAM_DEFAULT_DURATION_MINUTES,
  EXAM_EXTENDED_DURATION_MINUTES,
} from "@/lib/exam-config";

export const metadata = { title: "Exam selection" };

export default function ExamsPage() {
  const plan85 = allocateBlueprintQuotas(NCLEX_MIN_ITEMS);
  const plan150 = allocateBlueprintQuotas(NCLEX_MAX_ITEMS);

  return (
    <PageShell
      title="Exam selection"
      description="Choose NCLEX-style fixed practice (85 or 150), HESI-style mock (~150), or randomized blueprint-balanced sets. Blueprint quotas use 2026 NCLEX-RN Client Needs midpoints."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            href: "/exam?mode=nclex85",
            title: "NCLEX-style fixed (85)",
            detail: `${NCLEX_MIN_ITEMS} items · up to ${NCLEX_TIME_HOURS}h · no backtrack default`,
          },
          {
            href: "/exam?mode=nclex150",
            title: "NCLEX-style fixed (150)",
            detail: `${NCLEX_MAX_ITEMS} items · ${EXAM_EXTENDED_DURATION_MINUTES} min optional`,
          },
          {
            href: "/exam?mode=hesi150",
            title: "HESI-style mock (150)",
            detail: `Fixed-form · ${EXAM_DEFAULT_DURATION_MINUTES} min default · public structure only`,
          },
          {
            href: "/practice",
            title: "Custom / randomized",
            detail: "Pick Client Needs filters or randomize within blueprint",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]"
          >
            <h2 className="font-display text-lg font-semibold">{card.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{card.detail}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">
          2026 Client Needs blueprint (midpoint quotas)
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Official ranges from the 2026 NCLEX-RN Test Plan; delivered exams may vary ±3% per
          category. Not affiliated with NCSBN.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2 font-medium">Client Needs</th>
                <th className="px-3 py-2 font-medium">Official %</th>
                <th className="px-3 py-2 font-medium">85-item quota</th>
                <th className="px-3 py-2 font-medium">150-item quota</th>
              </tr>
            </thead>
            <tbody>
              {CLIENT_NEEDS_2026.map((c) => (
                <tr key={c.id} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2">{c.label}</td>
                  <td className="px-3 py-2 tabular-nums">
                    {c.minPercent}–{c.maxPercent}% (avg {c.avgPercent}%)
                  </td>
                  <td className="px-3 py-2 tabular-nums">{plan85[c.id]}</td>
                  <td className="px-3 py-2 tabular-nums">{plan150[c.id]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
