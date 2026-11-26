import { PageShell } from "@/components/PageShell";
import Link from "next/link";
import { PRACTICE_STOP_DISCLAIMER } from "@/lib/practice-stop";

export const metadata = { title: "Results" };

export default function Page() {
  return (
    <PageShell
      title="Results"
      description="The NCLEX 85 exam uses a practice stop rule. It is not an NCLEX pass."
    >
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="font-display text-xl font-semibold">Practice stop rule, not an NCLEX pass</h2>
        <p className="mt-3 text-sm leading-relaxed">{PRACTICE_STOP_DISCLAIMER}</p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          The threshold is 85% of points on scored items. Fifteen items are unscored pretest items.
          After you submit the NCLEX-style practice-length exam, that page shows whether the
          practice rule was met, plus skipped items and missed items with the correct answer.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/exam?mode=nclex85" className="text-sm font-medium text-[var(--accent)] hover:underline">
            NCLEX-style practice length
          </Link>
          <Link href="/exams" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Exam selection
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Dashboard
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
