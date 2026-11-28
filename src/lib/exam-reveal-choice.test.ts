import { describe, expect, it } from "vitest";
import { LOCAL_PERSIST_PREFIX, NCLEX85_DURATION_MINUTES, SESSION_MODES } from "./exam-config";
import {
  EXAM_REVEAL_CHOICE_PREFIX,
  REVEAL_CHOICE_COPY,
  examOffersRevealChoice,
  parseRevealChoice,
  resolveExamEndsAt,
  revealChoiceStorageKey,
  revealsDuringExam,
} from "./exam-reveal-choice";

describe("NCLEX reveal choice", () => {
  it("offers the choice on the shared NCLEX shell only", () => {
    expect(examOffersRevealChoice("nclex85")).toBe(true);
    expect(examOffersRevealChoice("nclex150")).toBe(true);
    expect(examOffersRevealChoice("hesi150")).toBe(false);
    expect(examOffersRevealChoice("practice")).toBe(false);
    expect(SESSION_MODES.nclex85.durationMinutes).toBe(NCLEX85_DURATION_MINUTES);
    expect(SESSION_MODES.nclex85.allowBacktrack).toBe(false);
    expect(SESSION_MODES.nclex85.practiceLength).toBe(true);
  });

  it("names both options", () => {
    expect(REVEAL_CHOICE_COPY["true-test"].title).toBe("True test");
    expect(REVEAL_CHOICE_COPY["practice-with-answers"].title).toBe("Practice with answers");
    expect(REVEAL_CHOICE_COPY["true-test"].detail).toContain("Show answer stays hidden");
    expect(REVEAL_CHOICE_COPY["practice-with-answers"].detail).toContain("Only the current question");
  });

  it("stores the choice for one attempt in this session, not in exam progress", () => {
    expect(revealChoiceStorageKey("compiled-nclex85-all-150")).toBe(
      `${EXAM_REVEAL_CHOICE_PREFIX}compiled-nclex85-all-150`,
    );
    expect(revealChoiceStorageKey("attempt-a")).not.toBe(revealChoiceStorageKey("attempt-b"));
    expect(revealChoiceStorageKey("attempt-a").startsWith(LOCAL_PERSIST_PREFIX)).toBe(false);
    expect(parseRevealChoice("true-test")).toBe("true-test");
    expect(parseRevealChoice("practice-with-answers")).toBe("practice-with-answers");
    expect(parseRevealChoice("tutor")).toBeNull();
    expect(parseRevealChoice(null)).toBeNull();
    expect(revealsDuringExam("true-test")).toBe(false);
    expect(revealsDuringExam("practice-with-answers")).toBe(true);
  });

  it("starts a full clock only when the student first chooses on a live session", () => {
    const endsAtIso = "2026-11-28T01:00:00.000Z";
    const nowMs = Date.parse("2026-11-28T00:00:00.000Z");
    expect(
      resolveExamEndsAt({
        clockAnchored: false,
        restored: false,
        endsAtIso,
        durationMinutes: 180,
        nowMs,
      }),
    ).toBe("2026-11-28T03:00:00.000Z");
    expect(
      resolveExamEndsAt({
        clockAnchored: true,
        restored: false,
        endsAtIso,
        durationMinutes: 180,
        nowMs,
      }),
    ).toBe(endsAtIso);
    expect(
      resolveExamEndsAt({
        clockAnchored: false,
        restored: true,
        endsAtIso,
        durationMinutes: 180,
        nowMs,
      }),
    ).toBe(endsAtIso);
  });
});
