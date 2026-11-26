import { Suspense } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { ExamPoolBanner } from "@/components/ExamPoolBanner";
import { SubmitButton } from "@/components/SubmitButton";
import { startExam } from "@/app/exam/actions";
import { CLIENT_NEEDS_2026 } from "@/lib/blueprint";
import { BLUEPRINT_BY_CLIENT_NEEDS } from "@/lib/exam-assemble";
import { getPoolStatus } from "@/lib/exam-session";

export const metadata = { title: "Custom practice" };

const COUNTS = [10, 20, 40] as const;

function clientNeedsOptions() {
  return CLIENT_NEEDS_2026.flatMap((category) => {
    const value = Object.entries(BLUEPRINT_BY_CLIENT_NEEDS).find(
      ([, id]) => id === category.id,
    )?.[0];
    return value ? [{ value, label: category.label }] : [];
  });
}

async function PracticeForm({ none }: { none: boolean }) {
  const status = await getPoolStatus();
  const options = clientNeedsOptions();
  return (
    <>
      <ExamPoolBanner source={status.source} notice={status.notice} />
      {none ? (
        <p className="mb-4 text-sm text-[var(--warn)]" role="status">
          No source-verified practice items match that Client Needs filter.
        </p>
      ) : null}
      <form action={startExam} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <input type="hidden" name="mode" value="practice" />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-medium">Client Needs</span>
            <select
              name="clientNeeds"
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
              defaultValue=""
            >
              <option value="">All Client Needs</option>
              {options.map((option) => {
                const available = status.byClientNeeds[option.value];
                const suffix =
                  status.source !== "example-fallback" && available != null
                    ? ` (${available})`
                    : "";
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                    {suffix}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="text-sm">
            <span className="font-medium">Number of items</span>
            <select
              name="count"
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
              defaultValue="20"
            >
              {COUNTS.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>
        </div>
        <SubmitButton className="mt-5 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          Start practice session
        </SubmitButton>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Items stay source-verified practice items. This page does not mark them clinically approved.
        </p>
      </form>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href="/exams" className="font-medium text-[var(--accent)] hover:underline">
          Exam selection
        </Link>
        <Link href="/dashboard" className="font-medium text-[var(--accent)] hover:underline">
          Dashboard
        </Link>
      </div>
    </>
  );
}

export default function PracticePage({
  searchParams,
}: PageProps<"/practice">) {
  return (
    <PageShell
      title="Custom practice"
      description="Build a set from source-verified practice items by Client Needs, or take a randomized mix."
    >
      <Suspense fallback={<p className="text-sm text-[var(--muted)]">Checking the question bank…</p>}>
        <PracticeFormLoader searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}

async function PracticeFormLoader({
  searchParams,
}: {
  searchParams: Promise<{ none?: string }>;
}) {
  const params = await searchParams;
  return <PracticeForm none={params.none === "1"} />;
}
