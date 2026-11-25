"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClientExamQuestion, LocalExamPersistence } from "@/lib/exam-config";
import { LOCAL_PERSIST_PREFIX } from "@/lib/exam-config";
import { remainingMs } from "@/lib/scoring";

type Props = {
  attemptId: string;
  questions: ClientExamQuestion[];
  endsAtIso: string;
  allowBacktrack?: boolean;
  onAutosave?: (payload: LocalExamPersistence) => void;
  onSubmit?: (payload: LocalExamPersistence) => void;
};

export function ExamRunner({
  attemptId,
  questions,
  endsAtIso,
  allowBacktrack = true,
  onAutosave,
  onSubmit,
}: Props) {
  const storageKey = `${LOCAL_PERSIST_PREFIX}${attemptId}`;
  const endsAt = useMemo(() => new Date(endsAtIso), [endsAtIso]);

  const [index, setIndex] = useState(0);
  const [flagged, setFlagged] = useState<string[]>([]);
  const [answers, setAnswers] = useState<
    Record<string, { selectedOptionIds?: string[] }>
  >({});
  const [now, setNow] = useState(() => Date.now());
  const [submitted, setSubmitted] = useState(false);

  // Resume from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as LocalExamPersistence;
      if (parsed.attemptId !== attemptId) return;
      setIndex(parsed.currentIndex ?? 0);
      setFlagged(parsed.flagged ?? []);
      setAnswers(parsed.answers ?? {});
    } catch {
      /* ignore corrupt local state */
    }
  }, [attemptId, storageKey]);

  const persist = useCallback(() => {
    const payload: LocalExamPersistence = {
      attemptId,
      currentIndex: index,
      flagged,
      answers,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      /* quota */
    }
    onAutosave?.(payload);
    return payload;
  }, [answers, attemptId, flagged, index, onAutosave, storageKey]);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setNow(Date.now());
      persist();
    }, 15_000);
    return () => clearInterval(t);
  }, [persist, submitted]);

  useEffect(() => {
    if (submitted) return;
    if (remainingMs(endsAt, new Date(now)) <= 0) {
      setSubmitted(true);
      onSubmit?.(persist());
    }
  }, [endsAt, now, onSubmit, persist, submitted]);

  const q = questions[index];
  const leftMs = remainingMs(endsAt, new Date(now));
  const mins = Math.floor(leftMs / 60_000);
  const secs = Math.floor((leftMs % 60_000) / 1000);

  if (!q) {
    return <p className="text-[var(--muted)]">No questions loaded.</p>;
  }

  const selected = answers[q.versionId]?.selectedOptionIds ?? [];

  function toggleOption(optionId: string, multi: boolean) {
    setAnswers((prev) => {
      const cur = prev[q.versionId]?.selectedOptionIds ?? [];
      let next: string[];
      if (multi) {
        next = cur.includes(optionId)
          ? cur.filter((id) => id !== optionId)
          : [...cur, optionId];
      } else {
        next = [optionId];
      }
      return { ...prev, [q.versionId]: { selectedOptionIds: next } };
    });
  }

  function go(delta: number) {
    if (!allowBacktrack && delta < 0) return;
    setIndex((i) => Math.min(questions.length - 1, Math.max(0, i + delta)));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <span aria-live="polite" className="font-mono tabular-nums">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="rounded-md border border-[var(--border)] px-3 py-1 hover:bg-[var(--surface-2)]"
          onClick={() =>
            setFlagged((f) =>
              f.includes(q.versionId)
                ? f.filter((id) => id !== q.versionId)
                : [...f, q.versionId],
            )
          }
        >
          {flagged.includes(q.versionId) ? "Unflag" : "Flag"}
        </button>
      </div>

      <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
          {q.topic ?? q.questionType}
        </p>
        <h2 className="font-display mt-2 text-xl font-semibold leading-snug">
          {q.stem}
        </h2>
        <ul className="mt-6 space-y-2">
          {q.options.map((opt) => {
            const multi = q.questionType === "MULTIPLE_RESPONSE";
            const checked = selected.includes(opt.id);
            return (
              <li key={opt.id}>
                <label className="flex cursor-pointer gap-3 rounded-lg border border-[var(--border)] px-3 py-3 hover:bg-[var(--surface-2)] has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-soft)]">
                  <input
                    type={multi ? "checkbox" : "radio"}
                    name={`q-${q.versionId}`}
                    checked={checked}
                    onChange={() => toggleOption(opt.id, multi)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-semibold">{opt.label}.</span> {opt.text}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </article>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!allowBacktrack || index === 0}
          onClick={() => go(-1)}
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={index >= questions.length - 1}
          onClick={() => go(1)}
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => {
            setSubmitted(true);
            onSubmit?.(persist());
          }}
          className="ml-auto rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Submit exam
        </button>
      </div>
      {submitted ? (
        <p className="text-sm text-[var(--warn)]" role="status">
          Submitted (or auto-submitted on timeout). Scoring runs on the server —
          correct answers are not available in Exam Mode until review.
        </p>
      ) : null}
    </div>
  );
}
