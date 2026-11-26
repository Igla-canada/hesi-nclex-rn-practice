import type { ClientExamQuestion, StoredAnswer } from "@/lib/exam-config";

export function applySkip(input: {
  versionId: string;
  index: number;
  questionCount: number;
  answers: Record<string, StoredAnswer>;
  flagged: string[];
  skipped: string[];
}): {
  answers: Record<string, StoredAnswer>;
  flagged: string[];
  skipped: string[];
  index: number;
} {
  const answers = { ...input.answers };
  delete answers[input.versionId];
  return {
    answers,
    flagged: input.flagged.includes(input.versionId)
      ? input.flagged
      : [...input.flagged, input.versionId],
    skipped: input.skipped.includes(input.versionId)
      ? input.skipped
      : [...input.skipped, input.versionId],
    index: input.index < input.questionCount - 1 ? input.index + 1 : input.index,
  };
}

/**
 * Answers that will be scored. Skipped questions are omitted.
 * Untouched ordered-response items keep the existing default-order recording.
 */
export function recordedAnswers(
  questions: ClientExamQuestion[],
  answers: Record<string, StoredAnswer>,
  skipped: string[],
): Record<string, StoredAnswer> {
  const skippedIds = new Set(skipped);
  const next: Record<string, StoredAnswer> = {};
  for (const [id, answer] of Object.entries(answers)) {
    if (!skippedIds.has(id)) next[id] = answer;
  }
  for (const question of questions) {
    if (skippedIds.has(question.versionId)) continue;
    const ordered =
      question.responseKind === "order" || question.questionType === "NGN_DRAG_DROP";
    if (ordered && !next[question.versionId]?.selectedOptionIds?.length) {
      next[question.versionId] = {
        ...next[question.versionId],
        selectedOptionIds: question.options.map((option) => option.id),
      };
    }
  }
  return next;
}
