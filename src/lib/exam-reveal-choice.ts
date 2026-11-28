import { SESSION_MODES, type SessionModeId } from "@/lib/exam-config";

/** Session-only answer visibility. A new browser session asks again. */
export const EXAM_REVEAL_CHOICES = ["true-test", "practice-with-answers"] as const;

export type ExamRevealChoice = (typeof EXAM_REVEAL_CHOICES)[number];

export const EXAM_REVEAL_CHOICE_PREFIX = "hesi-exam-reveal:v1:";

export const REVEAL_CHOICE_COPY: Record<
  ExamRevealChoice,
  { title: string; detail: string }
> = {
  "true-test": {
    title: "True test",
    detail:
      "Do not reveal correct answers or explanations during the exam. Show answer stays hidden. After you submit, the review of missed and skipped questions can still show the correct answer.",
  },
  "practice-with-answers": {
    title: "Practice with answers",
    detail:
      "On the current question, you can open the correct answer and the explanation. Only the current question.",
  },
};

const REVEAL_EVENT = "hesi-exam-reveal-change";

/** NCLEX exams share the live exam shell. Other modes keep Show answer. */
export function examOffersRevealChoice(mode: SessionModeId): boolean {
  return SESSION_MODES[mode].examMode === "NCLEX_FIXED";
}

export function revealChoiceStorageKey(attemptId: string): string {
  return `${EXAM_REVEAL_CHOICE_PREFIX}${attemptId}`;
}

export function parseRevealChoice(value: string | null | undefined): ExamRevealChoice | null {
  if (value === "true-test" || value === "practice-with-answers") return value;
  return null;
}

export function revealsDuringExam(choice: ExamRevealChoice): boolean {
  return choice === "practice-with-answers";
}

/**
 * A fresh choice on a live session starts the full clock.
 * A restored choice, or a stored attempt, keeps the clock already in progress.
 */
export function resolveExamEndsAt(input: {
  clockAnchored: boolean;
  restored: boolean;
  endsAtIso: string;
  durationMinutes: number;
  nowMs: number;
}): string {
  if (input.clockAnchored || input.restored) return input.endsAtIso;
  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
    return input.endsAtIso;
  }
  return new Date(input.nowMs + input.durationMinutes * 60_000).toISOString();
}

export function readRevealChoice(attemptId: string): ExamRevealChoice | null {
  if (typeof window === "undefined") return null;
  try {
    return parseRevealChoice(sessionStorage.getItem(revealChoiceStorageKey(attemptId)));
  } catch {
    return null;
  }
}

export function writeRevealChoice(attemptId: string, choice: ExamRevealChoice): void {
  sessionStorage.setItem(revealChoiceStorageKey(attemptId), choice);
  window.dispatchEvent(new Event(REVEAL_EVENT));
}

export function subscribeRevealChoice(onStoreChange: () => void): () => void {
  window.addEventListener(REVEAL_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(REVEAL_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}
