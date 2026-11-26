"use client";

import { useState } from "react";
import type { ClientExamQuestion, StoredAnswer } from "@/lib/exam-config";
import type { ReviewResponse } from "@/lib/exam-followup";
import type { PracticeStopResult } from "@/lib/practice-stop";

type Props = {
  questions: ClientExamQuestion[];
  answers: Record<string, StoredAnswer>;
  flagged: string[];
  skipped: string[];
  review: ReviewResponse | null;
  reviewError: boolean;
  practiceLength?: boolean;
  practiceStop?: PracticeStopResult | null;
  practiceStopError?: boolean;
};

function answerText(question: ClientExamQuestion, answer: StoredAnswer | undefined): string {
  if (!answer) return "No answer recorded";
  const labels = new Map(question.options.map((option) => [option.id, `${option.label}. ${option.text}`]));
  const selected = answer.selectedOptionIds ?? [];
  if (selected.length > 0) {
    return selected.map((id) => labels.get(id) ?? id).join("; ");
  }
  if (answer.numericValue?.trim()) return answer.numericValue.trim();
  const ngn = answer.ngnResponses ?? {};
  const parts = Object.entries(ngn).map(([key, value]) =>
    `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
  );
  return parts.length > 0 ? parts.join("; ") : "No answer recorded";
}

export function ExamFollowUp({
  questions,
  answers,
  flagged,
  skipped,
  review,
  reviewError,
  practiceLength = false,
  practiceStop = null,
  practiceStopError = false,
}: Props) {
  const flaggedIds = new Set(flagged);
  const skippedIds = new Set(skipped);
  const practice = questions.filter(
    (question) => flaggedIds.has(question.versionId) || skippedIds.has(question.versionId),
  );
  const mistakes = new Map((review?.mistakes ?? []).map((mistake) => [mistake.versionId, mistake]));
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string[]>>({});
  const current = practice[practiceIndex];

  const outcomeLabel =
    practiceStop?.outcome === "met"
      ? "Practice rule met"
      : practiceStop?.outcome === "not-met"
        ? "Practice rule not met"
        : null;

  return (
    <div className="space-y-8">
      {practiceLength ? (
        <section
          aria-labelledby="results-heading"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <h2 id="results-heading" className="font-display text-xl font-semibold">
            Results
          </h2>
          <p className="mt-2 text-sm font-semibold">
            This is a practice stop rule, not an NCLEX pass.
          </p>
          {practiceStop ? (
            <>
              <p className="mt-3 text-lg font-semibold">{outcomeLabel}</p>
              <p className="mt-2 text-sm">{practiceStop.summary}</p>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[var(--muted)]">Items completed</dt>
                  <dd>{practiceStop.administered}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Unscored pretest items</dt>
                  <dd>{practiceStop.pretestCount}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Scored items</dt>
                  <dd>{practiceStop.scoredCount}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Scored points</dt>
                  <dd>
                    {practiceStop.pointsEarned} / {practiceStop.pointsPossible} (
                    {practiceStop.scoredPercent}%)
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Practice threshold</dt>
                  <dd>{practiceStop.thresholdPercent}% of scored points</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Early stop lines</dt>
                  <dd>
                    {practiceStop.clearlyBelowPercent}% or {practiceStop.clearlyAbovePercent}%
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-[var(--muted)]">{practiceStop.disclaimer}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">
              {practiceStopError
                ? "The practice rule result could not be loaded. This is still a practice stop rule, not an NCLEX pass."
                : "Scoring the practice rule…"}
            </p>
          )}
        </section>
      ) : null}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="font-display text-xl font-semibold">After the exam</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          The live exam is closed. Correct answers were not available while the timer was running.
        </p>
        {review ? (
          <p className="mt-3 text-sm">
            Correct {review.counts.correct} · Incorrect {review.counts.incorrect} · Unanswered{" "}
            {review.counts.unanswered}
          </p>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">
            {reviewError ? "The answer key could not be loaded." : "Checking answers…"}
          </p>
        )}
        {review ? <p className="mt-2 text-sm text-[var(--muted)]">{review.disclaimer}</p> : null}
      </section>

      <section aria-labelledby="practice-heading" className="space-y-4">
        <h2 id="practice-heading" className="font-display text-xl font-semibold">
          Practice skipped and flagged questions
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Skip left these unanswered and marked for review. Flag still means mark for review. Work
          through them again here. This practice set does not reveal the correct answer.
        </p>
        {practice.length === 0 ? (
          <p className="text-sm">No questions were skipped or flagged.</p>
        ) : current ? (
          <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Question {current.index + 1}
              {skippedIds.has(current.versionId) ? " · Skipped" : ""}
              {flaggedIds.has(current.versionId) ? " · Flagged" : ""}
            </p>
            <h3 className="font-display mt-2 text-lg font-semibold leading-snug">{current.stem}</h3>
            <PracticeChoices
              question={current}
              selected={practiceAnswers[current.versionId] ?? []}
              onChange={(selected) =>
                setPracticeAnswers((prev) => ({ ...prev, [current.versionId]: selected }))
              }
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-40"
                disabled={practiceIndex === 0}
                onClick={() => setPracticeIndex((index) => Math.max(0, index - 1))}
              >
                Previous practice item
              </button>
              <button
                type="button"
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-40"
                disabled={practiceIndex >= practice.length - 1}
                onClick={() =>
                  setPracticeIndex((index) => Math.min(practice.length - 1, index + 1))
                }
              >
                Next practice item
              </button>
            </div>
          </article>
        ) : null}
      </section>

      <section aria-labelledby="mistakes-heading" className="space-y-4">
        <h2 id="mistakes-heading" className="font-display text-xl font-semibold">
          Questions answered incorrectly
        </h2>
        <p className="text-sm text-[var(--muted)]">
          These items include the correct answer and rationale so you can practice the mistake.
        </p>
        {!review && !reviewError ? <p className="text-sm">Loading the answer key…</p> : null}
        {review && review.mistakes.length === 0 ? (
          <p className="text-sm">No answered questions were incorrect.</p>
        ) : null}
        {reviewError ? (
          <p className="text-sm">
            Correct answers stay hidden because the review could not be loaded.
          </p>
        ) : null}
        {questions.map((question) => {
          const mistake = mistakes.get(question.versionId);
          if (!mistake) return null;
          return (
            <article
              key={question.versionId}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <h3 className="font-display text-lg font-semibold leading-snug">
                Question {question.index + 1}
              </h3>
              <p className="mt-2 leading-snug">{question.stem}</p>
              <p className="mt-4 text-sm">
                <span className="font-semibold">Your answer: </span>
                {answerText(question, answers[question.versionId])}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm">
                <span className="font-semibold">Correct answer: </span>
                {mistake.correctAnswer}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm">
                <span className="font-semibold">Rationale: </span>
                {mistake.rationale}
              </p>
              <MistakePractice question={question} correctOptionIds={mistake.correctOptionIds} />
            </article>
          );
        })}
      </section>
    </div>
  );
}

function PracticeChoices({
  question,
  selected,
  onChange,
}: {
  question: ClientExamQuestion;
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const kind = question.responseKind ?? "single";
  if (question.options.length === 0 && kind !== "numeric") {
    return <ChoiceList question={question} />;
  }
  if (kind === "numeric" || question.options.length === 0) {
    return (
      <label className="mt-4 block text-sm">
        Practice answer
        <input
          className="mt-2 w-full max-w-xs rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
          value={selected[0] ?? ""}
          onChange={(event) => onChange(event.target.value ? [event.target.value] : [])}
        />
      </label>
    );
  }
  const multi = kind === "multi";
  return (
    <ul className="mt-4 space-y-2">
      {question.options.map((option) => {
        const checked = selected.includes(option.id);
        return (
          <li key={option.id}>
            <label className="flex cursor-pointer gap-3 rounded-lg border border-[var(--border)] px-3 py-3">
              <input
                type={multi ? "checkbox" : "radio"}
                name={`practice-${question.versionId}`}
                checked={checked}
                onChange={() => {
                  if (!multi) {
                    onChange([option.id]);
                    return;
                  }
                  onChange(
                    checked ? selected.filter((id) => id !== option.id) : [...selected, option.id],
                  );
                }}
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
  );
}

function ChoiceList({ question }: { question: ClientExamQuestion }) {
  const groups = [
    question.matrix?.rows.map((row) => row.text),
    question.bowtie?.conditions.map((choice) => choice.text),
    question.bowtie?.actions.map((choice) => choice.text),
    question.bowtie?.parameters.map((choice) => choice.text),
    question.cloze?.blanks.flatMap((blank) => blank.choices.map((choice) => choice.text)),
  ].filter((group): group is string[] => Boolean(group && group.length > 0));
  if (groups.length === 0) return null;
  return (
    <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
      {groups.flat().map((text) => (
        <li key={text}>{text}</li>
      ))}
    </ul>
  );
}

function MistakePractice({
  question,
  correctOptionIds,
}: {
  question: ClientExamQuestion;
  correctOptionIds: string[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const correct = new Set(correctOptionIds);
  if (question.options.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2">
      {question.options.map((option) => {
        const isCorrect = correct.has(option.id) || correct.has(option.label);
        const checked = selected.includes(option.id);
        return (
          <li key={option.id}>
            <label
              className={`flex cursor-pointer gap-3 rounded-lg border px-3 py-3 ${
                isCorrect ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)]"
              }`}
            >
              <input
                type={question.responseKind === "multi" ? "checkbox" : "radio"}
                name={`mistake-${question.versionId}`}
                checked={checked}
                onChange={() => {
                  if (question.responseKind !== "multi") {
                    setSelected([option.id]);
                    return;
                  }
                  setSelected((current) =>
                    current.includes(option.id)
                      ? current.filter((id) => id !== option.id)
                      : [...current, option.id],
                  );
                }}
                className="mt-1"
              />
              <span>
                <span className="font-semibold">{option.label}.</span> {option.text}
                {isCorrect ? <span className="ml-2 text-sm font-semibold">Correct answer</span> : null}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
