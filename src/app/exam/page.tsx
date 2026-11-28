import { Suspense } from "react";
import Link from "next/link";
import { io } from "next/cache";
import { PageShell } from "@/components/PageShell";
import { ExamPoolBanner } from "@/components/ExamPoolBanner";
import { ExamRevealGate } from "@/components/ExamRevealGate";
import {
  isSessionModeId,
  SESSION_MODES,
  type ClientExamQuestion,
  type SessionModeId,
} from "@/lib/exam-config";
import { examOffersRevealChoice } from "@/lib/exam-reveal-choice";
import {
  loadStoredAttempt,
  renderLiveSession,
  sessionEndsAtIso,
  type RenderedExam,
} from "@/lib/exam-session";

export const metadata = { title: "Live examination" };

function ExamFallback({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[var(--muted)]">{children}</p>;
}

function PracticeLengthNote() {
  return (
    <p className="mb-4 text-sm text-[var(--muted)]">
      Practice length runs from 85 to 150 items drawn from the bank without repeats. Fifteen items
      are unscored and do not affect the stop rule. You cannot go back. The clock is 180 minutes.
      Results use a practice stop rule, not an NCLEX pass.
    </p>
  );
}

function ExamWorkspace({
  mode,
  modeLabel,
  attemptId,
  questions,
  endsAtIso,
  allowBacktrack,
  durationMinutes,
  clockAnchored,
  source,
  notice,
  note,
}: {
  mode: SessionModeId;
  modeLabel: string;
  attemptId: string;
  questions: ClientExamQuestion[];
  endsAtIso: string;
  allowBacktrack: boolean;
  durationMinutes: number;
  clockAnchored: boolean;
  source: "database" | "bank-file" | "example-fallback";
  notice: string;
  note?: string;
}) {
  const practiceLength = SESSION_MODES[mode].practiceLength;
  const requireChoice = examOffersRevealChoice(mode);
  return (
    <>
      <ExamPoolBanner source={source} notice={notice} />
      {note ? <p className="mb-4 text-sm">{note}</p> : null}
      <p className="mb-4 text-sm text-[var(--muted)]">
        Mode: <strong className="text-[var(--ink)]">{modeLabel}</strong>. Answers stay in this
        browser.
        {requireChoice
          ? null
          : " Show answer loads the correct answer for the current question only."}
      </p>
      <ExamRevealGate
        key={attemptId}
        requireChoice={requireChoice}
        attemptId={attemptId}
        questions={questions}
        endsAtIso={endsAtIso}
        allowBacktrack={allowBacktrack}
        practiceLength={practiceLength}
        durationMinutes={durationMinutes}
        clockAnchored={clockAnchored}
      >
        {practiceLength ? <PracticeLengthNote /> : null}
      </ExamRevealGate>
    </>
  );
}

function LiveSessionView({
  session,
  endsAtIso,
  note,
}: {
  session: RenderedExam;
  endsAtIso: string;
  note?: string;
}) {
  return (
    <ExamWorkspace
      mode={session.mode}
      modeLabel={session.modeLabel}
      attemptId={session.attemptId}
      questions={session.questions}
      endsAtIso={endsAtIso}
      allowBacktrack={session.allowBacktrack}
      durationMinutes={session.durationMinutes}
      clockAnchored={false}
      source={session.source}
      notice={session.notice}
      note={note}
    />
  );
}

async function ExamSession({
  searchParams,
}: {
  searchParams: Promise<{
    attempt?: string;
    mode?: string;
    clientNeeds?: string;
    count?: string;
  }>;
}) {
  await io();
  const params = await searchParams;

  if (params.attempt) {
    const loaded = await loadStoredAttempt(params.attempt);
    if (loaded) {
      return (
        <ExamWorkspace
          mode={loaded.mode}
          modeLabel={loaded.modeLabel}
          attemptId={loaded.attemptId}
          questions={loaded.questions}
          endsAtIso={loaded.endsAtIso}
          allowBacktrack={loaded.allowBacktrack}
          durationMinutes={SESSION_MODES[loaded.mode].durationMinutes}
          clockAnchored
          source="database"
          notice={loaded.notice}
        />
      );
    }
    const session = await renderLiveSession({ mode: "nclex85" });
    const endsAtIso = sessionEndsAtIso(session.durationMinutes);
    return (
      <LiveSessionView
        session={session}
        endsAtIso={endsAtIso}
        note="That saved session was not found. This page opened a new source-verified practice session instead."
      />
    );
  }

  const mode = params.mode && isSessionModeId(params.mode) ? params.mode : null;
  if (!mode) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm">
        <p>
          Start a session from exam selection or custom practice. A session loads source-verified
          practice items from Postgres when they are imported, and from the compiled question bank
          file until then.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/exams" className="font-medium text-[var(--accent)] hover:underline">
            Exam selection
          </Link>
          <Link href="/practice" className="font-medium text-[var(--accent)] hover:underline">
            Custom practice
          </Link>
          <Link
            href="/exam?mode=nclex85"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            NCLEX-style practice length
          </Link>
        </div>
      </div>
    );
  }

  const count = Number(params.count);
  const session = await renderLiveSession({
    mode,
    clientNeeds: params.clientNeeds,
    count: Number.isFinite(count) ? count : undefined,
  });
  const endsAtIso = sessionEndsAtIso(session.durationMinutes);
  return <LiveSessionView session={session} endsAtIso={endsAtIso} />;
}

export default function ExamPage({ searchParams }: PageProps<"/exam">) {
  return (
    <PageShell title="Live examination">
      <Suspense fallback={<ExamFallback>Loading examination session…</ExamFallback>}>
        <ExamSession searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}
