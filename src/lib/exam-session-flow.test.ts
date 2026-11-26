import { describe, expect, it } from "vitest";
import {
  EXAM_DEFAULT_DURATION_MINUTES,
  EXAM_EXTENDED_DURATION_MINUTES,
  NCLEX85_DURATION_MINUTES,
  SESSION_MODES,
} from "./exam-config";
import { applySkip, recordedAnswers } from "./exam-skip";
import { reviewCompiledSubmission } from "./exam-review";
import type { ClientExamQuestion, StoredAnswer } from "./exam-config";

describe("NCLEX 85 duration", () => {
  it("uses 180 minutes and leaves the other modes on their own limits", () => {
    expect(NCLEX85_DURATION_MINUTES).toBe(180);
    expect(SESSION_MODES.nclex85.durationMinutes).toBe(180);
    expect(SESSION_MODES.nclex85.detail).toContain("3h");
    expect(SESSION_MODES.nclex150.durationMinutes).toBe(EXAM_EXTENDED_DURATION_MINUTES);
    expect(SESSION_MODES.hesi150.durationMinutes).toBe(EXAM_DEFAULT_DURATION_MINUTES);
    expect(SESSION_MODES.nclex85.allowBacktrack).toBe(false);
    expect(SESSION_MODES.nclex150.allowBacktrack).toBe(false);
  });
});

describe("skip", () => {
  const base = {
    index: 1,
    questionCount: 85,
    answers: { q2: { selectedOptionIds: ["A"] } } as Record<string, StoredAnswer>,
    flagged: [] as string[],
    skipped: [] as string[],
    versionId: "q2",
  };

  it("clears the answer, flags the item, and moves forward", () => {
    const next = applySkip(base);
    expect(next.answers.q2).toBeUndefined();
    expect(next.flagged).toEqual(["q2"]);
    expect(next.skipped).toEqual(["q2"]);
    expect(next.index).toBe(2);
  });

  it("does not move backward and stays on the last item", () => {
    const next = applySkip({ ...base, index: 84 });
    expect(next.index).toBe(84);
  });

  it("does not record an ordered-response default for a skipped item", () => {
    const questions = [
      {
        versionId: "order-1",
        responseKind: "order",
        questionType: "NGN_DRAG_DROP",
        options: [
          { id: "A", label: "A", text: "First" },
          { id: "B", label: "B", text: "Second" },
        ],
      },
      {
        versionId: "order-2",
        responseKind: "order",
        questionType: "NGN_DRAG_DROP",
        options: [
          { id: "C", label: "C", text: "Third" },
          { id: "D", label: "D", text: "Fourth" },
        ],
      },
    ] as ClientExamQuestion[];
    const saved = recordedAnswers(questions, {}, ["order-1"]);
    expect(saved["order-1"]).toBeUndefined();
    expect(saved["order-2"]?.selectedOptionIds).toEqual(["C", "D"]);
  });
});

describe("post-submit review", () => {
  it("hides the key for a correct or unanswered item and shows it for a wrong one", () => {
    const correct = reviewCompiledSubmission([
      {
        id: "ONRN-PA-0001",
        versionId: "file-ONRN-PA-0001",
        answer: { selectedOptionIds: ["B"] },
      },
    ]);
    expect(correct.mistakes).toEqual([]);
    expect(correct.counts.correct).toBe(1);
    expect(JSON.stringify(correct)).not.toContain("peaked T waves");
    expect(JSON.stringify(correct)).not.toContain("usually the first visible ECG change");

    const skipped = reviewCompiledSubmission([
      { id: "ONRN-PA-0001", versionId: "file-ONRN-PA-0001", answer: null },
    ]);
    expect(skipped.mistakes).toEqual([]);
    expect(skipped.counts.unanswered).toBe(1);
    expect(JSON.stringify(skipped)).not.toContain("peaked T waves");

    const wrong = reviewCompiledSubmission([
      {
        id: "ONRN-PA-0001",
        versionId: "file-ONRN-PA-0001",
        answer: { selectedOptionIds: ["A"] },
      },
    ]);
    expect(wrong.counts.incorrect).toBe(1);
    expect(wrong.mistakes).toHaveLength(1);
    expect(wrong.mistakes[0]?.correctAnswer).toContain("Tall, narrow, peaked T waves");
    expect(wrong.mistakes[0]?.rationale).toContain("usually the first visible ECG change");
    expect(wrong.mistakes[0]?.correctOptionIds).toEqual(["B"]);
  });
});
