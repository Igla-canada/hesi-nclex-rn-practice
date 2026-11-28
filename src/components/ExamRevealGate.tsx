"use client";

import { useState, useSyncExternalStore } from "react";
import type { ClientExamQuestion } from "@/lib/exam-config";
import {
  EXAM_REVEAL_CHOICES,
  REVEAL_CHOICE_COPY,
  readRevealChoice,
  resolveExamEndsAt,
  subscribeRevealChoice,
  writeRevealChoice,
  type ExamRevealChoice,
} from "@/lib/exam-reveal-choice";
import { ExamRunner } from "@/components/ExamRunner";

type Props = {
  requireChoice: boolean;
  attemptId: string;
  questions: ClientExamQuestion[];
  endsAtIso: string;
  allowBacktrack: boolean;
  practiceLength: boolean;
  durationMinutes: number;
  clockAnchored: boolean;
  children?: React.ReactNode;
};

export function ExamRevealGate({
  requireChoice,
  attemptId,
  questions,
  endsAtIso,
  allowBacktrack,
  practiceLength,
  durationMinutes,
  clockAnchored,
  children,
}: Props) {
  const storedChoice = useSyncExternalStore(
    subscribeRevealChoice,
    () => (requireChoice ? readRevealChoice(attemptId) : null),
    () => null,
  );
  const [picked, setPicked] = useState<ExamRevealChoice | null>(null);
  const [endsOverride, setEndsOverride] = useState<string | null>(null);
  const choice = requireChoice ? (picked ?? storedChoice) : null;

  function start(next: ExamRevealChoice) {
    setPicked(next);
    try {
      writeRevealChoice(attemptId, next);
    } catch {
      /* This session cannot store the choice. The exam still starts. */
    }
    if (!clockAnchored) {
      setEndsOverride(
        resolveExamEndsAt({
          clockAnchored: false,
          restored: false,
          endsAtIso,
          durationMinutes,
          nowMs: Date.now(),
        }),
      );
    }
  }

  if (requireChoice && !choice) {
    return (
      <>
        <RevealChoiceScreen clockAnchored={clockAnchored} onStart={start} />
        {children}
      </>
    );
  }

  return (
    <>
      {children}
      {choice ? <RevealChoiceStatus choice={choice} /> : null}
      <ExamRunner
        attemptId={attemptId}
        questions={questions}
        endsAtIso={endsOverride ?? endsAtIso}
        allowBacktrack={allowBacktrack}
        practiceLength={practiceLength}
        revealDuringExam={choice !== "true-test"}
      />
    </>
  );
}

function RevealChoiceScreen({
  clockAnchored,
  onStart,
}: {
  clockAnchored: boolean;
  onStart: (choice: ExamRevealChoice) => void;
}) {
  const [selected, setSelected] = useState<ExamRevealChoice | null>(null);

  return (
    <section
      aria-labelledby="reveal-choice-heading"
      data-exam-stage="reveal-choice"
      className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
    >
      <h2 id="reveal-choice-heading" className="font-display text-xl font-semibold">
        Before question 1
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Choose how this exam treats correct answers. This browser session remembers the choice. A
        new session asks again.
      </p>
      <fieldset className="mt-6 space-y-3">
        <legend className="sr-only">How this exam shows answers</legend>
        {EXAM_REVEAL_CHOICES.map((id) => {
          const copy = REVEAL_CHOICE_COPY[id];
          return (
            <label
              key={id}
              className="flex cursor-pointer gap-3 rounded-lg border border-[var(--border)] px-4 py-4 has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-soft)]"
            >
              <input
                type="radio"
                name="exam-reveal-choice"
                value={id}
                data-exam-choice={id}
                checked={selected === id}
                onChange={() => setSelected(id)}
                className="mt-1"
              />
              <span>
                <span className="font-semibold">{copy.title}</span>
                <span className="mt-1 block text-sm text-[var(--muted)]">{copy.detail}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
      <p className="mt-4 text-sm text-[var(--muted)]">
        {clockAnchored
          ? "The exam clock keeps running while you choose."
          : "The clock starts when you start the exam."}
      </p>
      <button
        type="button"
        data-exam-control="start-exam"
        disabled={selected == null}
        onClick={() => {
          if (selected) onStart(selected);
        }}
        className="mt-4 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        Start exam
      </button>
    </section>
  );
}

function RevealChoiceStatus({ choice }: { choice: ExamRevealChoice }) {
  return (
    <p className="mb-4 text-sm text-[var(--muted)]" data-exam-reveal={choice}>
      {choice === "true-test"
        ? "True test. Correct answers and explanations stay hidden until you submit."
        : "Practice with answers. Show answer opens the correct answer and explanation for the current question only."}
    </p>
  );
}
