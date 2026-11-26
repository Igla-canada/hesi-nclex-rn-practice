import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { ExamPoolBanner } from "@/components/ExamPoolBanner";
import { SubmitButton } from "@/components/SubmitButton";
import { startExam } from "@/app/exam/actions";
import {
  CLIENT_NEEDS_2026,
  allocateBlueprintQuotas,
  NCLEX_MAX_ITEMS,
  NCLEX_MIN_ITEMS,
} from "@/lib/blueprint";
import { SESSION_MODES, type SessionModeId } from "@/lib/exam-config";
import { getPoolStatus } from "@/lib/exam-session";

export const metadata = { title: "Exam selection" };

const CHOICES: SessionModeId[] = ["nclex85", "nclex150", "hesi150"];

async function ExamChooser() {
  const status = await getPoolStatus();
  return (
    <>
      <ExamPoolBanner source={status.source} notice={status.notice} />
      <div className="grid gap-4 md:grid-cols-2">
        {CHOICES.map((mode) => {
          const spec = SESSION_MODES[mode];
          return (
            <form key={mode} action={startExam}>
              <input type="hidden" name="mode" value={mode} />
              <SubmitButton className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left hover:border-[var(--accent)] disabled:opacity-60">
                <span className="font-display block text-lg font-semibold">{spec.label}</span>
                <span className="mt-1 block text-sm text-[var(--muted)]">{spec.detail}</span>
              </SubmitButton>
            </form>
          );
        })}
        <form action={startExam}>
          <input type="hidden" name="mode" value="practice" />
          <input type="hidden" name="count" value="20" />
          <SubmitButton className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left hover:border-[var(--accent)] disabled:opacity-60">
            <span className="font-display block text-lg font-semibold">Custom / randomized</span>
            <span className="mt-1 block text-sm text-[var(--muted)]">
              20 items across Client Needs. Open custom practice to filter.
            </span>
          </SubmitButton>
        </form>
      </div>
    </>
  );
}

export default function ExamsPage() {
  const plan85 = allocateBlueprintQuotas(NCLEX_MIN_ITEMS);
  const plan150 = allocateBlueprintQuotas(NCLEX_MAX_ITEMS);

  return (
    <PageShell
      title="Exam selection"
      description="Choose NCLEX-style fixed practice (85 or 150), HESI-style mock (~150), or a randomized set. A session loads source-verified practice items. Clinically approved items stay at zero until a reviewer approves them."
    >
      <Suspense fallback={<p className="mb-4 text-sm text-[var(--muted)]">Checking the question bank…</p>}>
        <ExamChooser />
      </Suspense>

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
              {CLIENT_NEEDS_2026.map((category) => (
                <tr key={category.id} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2">{category.label}</td>
                  <td className="px-3 py-2 tabular-nums">
                    {category.minPercent}–{category.maxPercent}% (avg {category.avgPercent}%)
                  </td>
                  <td className="px-3 py-2 tabular-nums">{plan85[category.id]}</td>
                  <td className="px-3 py-2 tabular-nums">{plan150[category.id]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
