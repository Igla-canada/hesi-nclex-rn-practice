"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ClientExamQuestion,
  ClientResponseKind,
  LocalExamPersistence,
  StoredAnswer,
} from "@/lib/exam-config";
import { LOCAL_PERSIST_PREFIX } from "@/lib/exam-config";
import type { ReviewResponse } from "@/lib/exam-followup";
import { applySkip, recordedAnswers } from "@/lib/exam-skip";
import { remainingMs } from "@/lib/scoring";
import { ExamFollowUp } from "@/components/ExamFollowUp";

type Props = {
  attemptId: string;
  questions: ClientExamQuestion[];
  endsAtIso: string;
  allowBacktrack?: boolean;
  onAutosave?: (payload: LocalExamPersistence) => void;
  onSubmit?: (payload: LocalExamPersistence) => void;
};

const TYPE_LABEL: Record<string, string> = {
  MULTIPLE_CHOICE: "Multiple choice",
  MULTIPLE_RESPONSE: "Select all that apply",
  NGN_MATRIX: "Matrix",
  NGN_CLOZE: "Cloze",
  NGN_BOW_TIE: "Bow-tie",
  NGN_DRAG_DROP: "Ordered response",
};

function kindOf(question: ClientExamQuestion): ClientResponseKind {
  if (question.responseKind) return question.responseKind;
  if (question.questionType === "MULTIPLE_RESPONSE") return "multi";
  if (question.matrix) return "matrix";
  if (question.cloze) return "cloze";
  if (question.bowtie) return "bowtie";
  if (question.options.length === 0) return "numeric";
  return "single";
}

function asStringList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return [];
}

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
  const [skipped, setSkipped] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, StoredAnswer>>({});
  const [now, setNow] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [reviewError, setReviewError] = useState(false);
  const reviewStarted = useRef(false);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as LocalExamPersistence;
      if (parsed.attemptId !== attemptId) return;
      // Local progress is read after mount so the server render stays free of saved answers.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndex(parsed.currentIndex ?? 0);
      setFlagged(parsed.flagged ?? []);
      setSkipped(parsed.skipped ?? []);
      setAnswers(parsed.answers ?? {});
    } catch {
      /* ignore corrupt local state */
    }
  }, [attemptId, storageKey]);

  const snapshot = useCallback(
    (
      currentAnswers: Record<string, StoredAnswer>,
      currentIndex: number,
      currentFlagged: string[],
      currentSkipped: string[],
    ) => {
      const nextAnswers = recordedAnswers(questions, currentAnswers, currentSkipped);
      const payload: LocalExamPersistence = {
        attemptId,
        currentIndex,
        flagged: currentFlagged,
        skipped: currentSkipped,
        answers: nextAnswers,
        updatedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch {
        /* quota */
      }
      onAutosave?.(payload);
      return payload;
    },
    [attemptId, onAutosave, questions, storageKey],
  );

  const persist = useCallback(
    () => snapshot(answers, index, flagged, skipped),
    [answers, flagged, index, skipped, snapshot],
  );

  const finish = useCallback(
    (payload: LocalExamPersistence) => {
      if (reviewStarted.current) return;
      reviewStarted.current = true;
      setSubmitted(true);
      onSubmit?.(payload);
      void (async () => {
        try {
          const response = await fetch("/api/exam/review", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              items: questions.map((item) => ({
                id: item.id,
                versionId: item.versionId,
                answer: payload.answers[item.versionId] ?? null,
              })),
            }),
          });
          if (!response.ok) {
            setReviewError(true);
            return;
          }
          setReview((await response.json()) as ReviewResponse);
        } catch {
          setReviewError(true);
        }
      })();
    },
    [onSubmit, questions],
  );

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      persist();
    }, 15_000);
    return () => clearInterval(timer);
  }, [persist, submitted]);

  useEffect(() => {
    if (submitted || now == null) return;
    if (remainingMs(endsAt, new Date(now)) <= 0) {
      finish(persist());
    }
  }, [endsAt, finish, now, persist, submitted]);

  const question = questions[index];
  const leftMs = now == null ? null : remainingMs(endsAt, new Date(now));
  const mins = leftMs == null ? null : Math.floor(leftMs / 60_000);
  const secs = leftMs == null ? null : Math.floor((leftMs % 60_000) / 1000);

  if (submitted) {
    return (
      <ExamFollowUp
        questions={questions}
        answers={answers}
        flagged={flagged}
        skipped={skipped}
        review={review}
        reviewError={reviewError}
      />
    );
  }

  if (!question) {
    return <p className="text-[var(--muted)]">No questions loaded.</p>;
  }

  const kind = kindOf(question);
  const answer = answers[question.versionId] ?? {};
  const selected = answer.selectedOptionIds ?? [];
  const ngn = answer.ngnResponses ?? {};

  const locked = skipped.includes(question.versionId);

  function write(next: StoredAnswer) {
    if (locked) return;
    setAnswers((prev) => ({ ...prev, [question.versionId]: next }));
  }

  function skip() {
    if (locked) return;
    const next = applySkip({
      versionId: question.versionId,
      index,
      questionCount: questions.length,
      answers,
      flagged,
      skipped,
    });
    setAnswers(next.answers);
    setFlagged(next.flagged);
    setSkipped(next.skipped);
    setIndex(next.index);
    snapshot(next.answers, next.index, next.flagged, next.skipped);
  }

  function toggleOption(optionId: string, multi: boolean) {
    const current = answer.selectedOptionIds ?? [];
    const next = multi
      ? current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
      : [optionId];
    write({ ...answer, selectedOptionIds: next });
  }

  function setNgnValue(key: string, value: string | string[]) {
    write({ ...answer, ngnResponses: { ...ngn, [key]: value } });
  }

  function toggleLimited(key: string, optionId: string, max: number) {
    const current = asStringList(ngn[key]);
    const next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : current.length >= max
        ? current
        : [...current, optionId];
    setNgnValue(key, next);
  }

  function moveOrder(optionId: string, direction: -1 | 1) {
    const order =
      selected.length > 0 ? [...selected] : question.options.map((option) => option.id);
    const from = order.indexOf(optionId);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= order.length) return;
    const moved = order[from]!;
    order[from] = order[to]!;
    order[to] = moved;
    write({ ...answer, selectedOptionIds: order });
  }

  function go(delta: number) {
    if (!allowBacktrack && delta < 0) return;
    setIndex((current) => Math.min(questions.length - 1, Math.max(0, current + delta)));
  }

  const orderedOptions =
    kind === "order"
      ? (selected.length > 0 ? selected : question.options.map((option) => option.id))
          .map((id) => question.options.find((option) => option.id === id))
          .filter((option): option is NonNullable<typeof option> => Boolean(option))
      : question.options;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <span aria-live="polite" className="font-mono tabular-nums">
          {mins == null || secs == null
            ? "--:--"
            : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`}
        </span>
        <button
          type="button"
          className="rounded-md border border-[var(--border)] px-3 py-1 hover:bg-[var(--surface-2)]"
          onClick={() =>
            setFlagged((current) =>
              current.includes(question.versionId)
                ? current.filter((id) => id !== question.versionId)
                : [...current, question.versionId],
            )
          }
        >
          {flagged.includes(question.versionId) ? "Unflag" : "Flag"}
        </button>
      </div>

      {locked ? (
        <p className="text-sm text-[var(--muted)]">
          Skipped. No answer was recorded, and this question stays closed until after you submit.
        </p>
      ) : null}
      <article
        className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 ${
          locked ? "pointer-events-none opacity-70" : ""
        }`}
      >
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
          {question.topic ?? TYPE_LABEL[question.questionType] ?? question.questionType}
        </p>
        <h2 className="font-display mt-2 text-xl font-semibold leading-snug">{question.stem}</h2>
        {kind === "multi" ? (
          <p className="mt-2 text-sm text-[var(--muted)]">Select all that apply.</p>
        ) : null}
        {kind === "order" ? (
          <p className="mt-2 text-sm text-[var(--muted)]">Place the actions in order from first to last.</p>
        ) : null}

        {kind === "single" || kind === "multi" ? (
          <ul className="mt-6 space-y-2">
            {question.options.map((option) => {
              const checked = selected.includes(option.id);
              return (
                <li key={option.id}>
                  <label className="flex cursor-pointer gap-3 rounded-lg border border-[var(--border)] px-3 py-3 hover:bg-[var(--surface-2)] has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-soft)]">
                    <input
                      type={kind === "multi" ? "checkbox" : "radio"}
                      name={`q-${question.versionId}`}
                      checked={checked}
                      onChange={() => toggleOption(option.id, kind === "multi")}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-semibold">{option.label}.</span> {option.text}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        ) : null}

        {kind === "matrix" && question.matrix ? (
          <div className="mt-6 space-y-4">
            {question.matrix.rows.map((row) => (
              <fieldset key={row.id} className="rounded-lg border border-[var(--border)] p-3">
                <legend className="px-1 text-sm font-medium">{row.text}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {question.matrix?.columns.map((column) => (
                    <label
                      key={column}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-soft)]"
                    >
                      <input
                        type="radio"
                        name={`matrix-${question.versionId}-${row.id}`}
                        checked={ngn[row.id] === column}
                        onChange={() => setNgnValue(row.id, column)}
                      />
                      {column}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        ) : null}

        {kind === "cloze" && question.cloze ? (
          <p className="mt-6 text-base leading-8">
            {question.cloze.template.split(/\{(B\d+)\}/g).map((part, partIndex) => {
              const blank = question.cloze?.blanks.find((entry) => entry.id === part);
              if (!blank) return <span key={`${partIndex}-${part}`}>{part}</span>;
              const value = typeof ngn[blank.id] === "string" ? ngn[blank.id] : "";
              return (
                <label key={blank.id} className="mx-1 inline-flex align-middle">
                  <span className="sr-only">Blank {blank.id}</span>
                  <select
                    className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
                    value={value}
                    onChange={(event) => setNgnValue(blank.id, event.target.value)}
                  >
                    <option value="">Select</option>
                    {blank.choices.map((choice) => (
                      <option key={choice.id} value={choice.id}>
                        {choice.text}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
          </p>
        ) : null}

        {kind === "bowtie" && question.bowtie ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <ChoiceGroup
              legend="Potential condition (choose 1)"
              choices={question.bowtie.conditions}
              name={`condition-${question.versionId}`}
              type="radio"
              selected={typeof ngn.condition === "string" ? [ngn.condition] : []}
              onToggle={(id) => setNgnValue("condition", id)}
            />
            <ChoiceGroup
              legend="Actions to take (choose 2)"
              choices={question.bowtie.actions}
              name={`actions-${question.versionId}`}
              type="checkbox"
              selected={asStringList(ngn.actions)}
              onToggle={(id) => toggleLimited("actions", id, 2)}
            />
            <ChoiceGroup
              legend="Parameters to monitor (choose 2)"
              choices={question.bowtie.parameters}
              name={`parameters-${question.versionId}`}
              type="checkbox"
              selected={asStringList(ngn.parameters)}
              onToggle={(id) => toggleLimited("parameters", id, 2)}
            />
          </div>
        ) : null}

        {kind === "order" ? (
          <ol className="mt-6 space-y-2">
            {orderedOptions.map((option, optionIndex) => (
              <li
                key={option.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-3"
              >
                <span className="w-6 font-mono text-sm text-[var(--muted)]">{optionIndex + 1}</span>
                <span className="flex-1">
                  <span className="font-semibold">{option.label}.</span> {option.text}
                </span>
                <button
                  type="button"
                  className="rounded-md border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-40"
                  disabled={optionIndex === 0}
                  onClick={() => moveOrder(option.id, -1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="rounded-md border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-40"
                  disabled={optionIndex === orderedOptions.length - 1}
                  onClick={() => moveOrder(option.id, 1)}
                >
                  Down
                </button>
              </li>
            ))}
          </ol>
        ) : null}

        {kind === "numeric" ? (
          <label className="mt-6 block text-sm">
            Numeric answer
            <input
              inputMode="decimal"
              className="mt-2 w-full max-w-xs rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
              value={answer.numericValue ?? ""}
              onChange={(event) => write({ ...answer, numericValue: event.target.value })}
            />
          </label>
        ) : null}
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
          disabled={locked}
          onClick={skip}
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-40"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={() => finish(persist())}
          className="ml-auto rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Submit exam
        </button>
      </div>
    </div>
  );
}

function ChoiceGroup({
  legend,
  choices,
  name,
  type,
  selected,
  onToggle,
}: {
  legend: string;
  choices: Array<{ id: string; text: string }>;
  name: string;
  type: "radio" | "checkbox";
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="rounded-lg border border-[var(--border)] p-3">
      <legend className="px-1 text-sm font-medium">{legend}</legend>
      <ul className="mt-2 space-y-2">
        {choices.map((choice) => (
          <li key={choice.id}>
            <label className="flex cursor-pointer gap-2 text-sm has-[:checked]:text-[var(--ink)]">
              <input
                type={type}
                name={name}
                checked={selected.includes(choice.id)}
                onChange={() => onToggle(choice.id)}
                className="mt-1"
              />
              <span>{choice.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
