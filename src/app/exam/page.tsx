import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { ExamRunner } from "@/components/ExamRunner";
import {
  EXAM_DEFAULT_DURATION_MINUTES,
  EXAM_EXTENDED_DURATION_MINUTES,
  type ClientExamQuestion,
} from "@/lib/exam-config";

export const metadata = { title: "Live examination" };

/** Demo questions for UI — EXAMPLE / not clinically verified. No answer keys sent. */
const DEMO_QUESTIONS: ClientExamQuestion[] = [
  {
    id: "demo-1",
    versionId: "demo-v1",
    index: 0,
    stem: "[EXAMPLE — AWAITING CLINICAL REVIEW] Placeholder prioritization stem for exam UI wiring only.",
    questionType: "MULTIPLE_CHOICE",
    topic: "Management of Care",
    options: [
      { id: "o1", label: "A", text: "[Placeholder option A]" },
      { id: "o2", label: "B", text: "[Placeholder option B]" },
      { id: "o3", label: "C", text: "[Placeholder option C]" },
      { id: "o4", label: "D", text: "[Placeholder option D]" },
    ],
  },
  {
    id: "demo-2",
    versionId: "demo-v2",
    index: 1,
    stem: "[EXAMPLE — DRAFT] Select all that apply — placeholder SATA (no clinical claim).",
    questionType: "MULTIPLE_RESPONSE",
    topic: "Safety and Infection Prevention and Control",
    options: [
      { id: "p1", label: "A", text: "[Placeholder selectable A]" },
      { id: "p2", label: "B", text: "[Placeholder selectable B]" },
      { id: "p3", label: "C", text: "[Placeholder selectable C]" },
      { id: "p4", label: "D", text: "[Placeholder selectable D]" },
    ],
  },
];

async function ExamSession({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const sp = await searchParams;
  const mode = sp.mode ?? "hesi150";
  const duration =
    mode === "nclex85" || mode === "nclex150"
      ? EXAM_EXTENDED_DURATION_MINUTES
      : EXAM_DEFAULT_DURATION_MINUTES;
  const endsAt = new Date(Date.now() + duration * 60_000).toISOString();
  const attemptId = `demo-${mode}`;

  return (
    <>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Mode: <strong className="text-[var(--ink)]">{mode}</strong>. Timed Exam Mode with
        autosave, flag, nav, and auto-submit on timeout. Correct answers are never sent to
        the client in Exam Mode.
      </p>
      <ExamRunner
        attemptId={attemptId}
        questions={DEMO_QUESTIONS}
        endsAtIso={endsAt}
        allowBacktrack={mode !== "nclex85" && mode !== "nclex150"}
      />
    </>
  );
}

export default function ExamPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  return (
    <PageShell title="Live examination">
      <Suspense
        fallback={
          <p className="text-sm text-[var(--muted)]">Loading examination session…</p>
        }
      >
        <ExamSession searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}
