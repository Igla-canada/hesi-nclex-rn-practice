import { describe, expect, it } from "vitest";
import {
  computeEndsAt,
  isTimedOut,
  remainingMs,
  scoreAttempt,
  scoreItem,
  scorePlusMinus,
  scoreRationale,
  scoreZeroOne,
} from "./scoring";
import { allocateBlueprintQuotas, isWithinBlueprintTolerance } from "./blueprint";

describe("zero_one / dichotomous", () => {
  it("awards full points when selection matches", () => {
    const s = scoreZeroOne(
      { selectedOptionIds: ["a"] },
      { method: "zero_one", correctOptionIds: ["a"], pointsMax: 1 },
    );
    expect(s.pointsEarned).toBe(1);
    expect(s.isFullyCorrect).toBe(true);
  });

  it("awards 0 when wrong", () => {
    const s = scoreItem(
      { selectedOptionIds: ["b"] },
      { method: "dichotomous", correctOptionIds: ["a"], pointsMax: 1 },
    );
    expect(s.pointsEarned).toBe(0);
  });
});

describe("plus_minus (SATA)", () => {
  it("floors at 0", () => {
    const s = scorePlusMinus(
      { selectedOptionIds: ["x", "y", "z"] },
      {
        method: "plus_minus",
        correctOptionIds: ["a"],
        pointsMax: 1,
      },
    );
    expect(s.pointsEarned).toBe(0);
  });

  it("gives partial credit for subset", () => {
    const s = scorePlusMinus(
      { selectedOptionIds: ["a", "b"] },
      {
        method: "plus_minus",
        correctOptionIds: ["a", "b", "c"],
        pointsMax: 3,
      },
    );
    expect(s.pointsEarned).toBe(2);
    expect(s.isFullyCorrect).toBe(false);
  });
});

describe("rationale", () => {
  it("requires both pair parts", () => {
    const correct = {
      method: "rationale" as const,
      pointsMax: 1,
      rationalePairs: [{ left: "cause1", right: "effect1" }],
    };
    expect(
      scoreRationale({ rationalePairs: [{ left: "cause1", right: "wrong" }] }, correct)
        .pointsEarned,
    ).toBe(0);
    expect(
      scoreRationale(
        { rationalePairs: [{ left: "cause1", right: "effect1" }] },
        correct,
      ).pointsEarned,
    ).toBe(1);
  });
});

describe("attempt aggregate", () => {
  it("keeps accuracy % separate from points", () => {
    const summary = scoreAttempt(
      [
        {
          answer: { selectedOptionIds: ["a", "b"] },
          correct: {
            method: "plus_minus",
            correctOptionIds: ["a", "b", "c"],
            pointsMax: 3,
          },
        },
        {
          answer: { selectedOptionIds: ["x"] },
          correct: {
            method: "dichotomous",
            correctOptionIds: ["x"],
            pointsMax: 1,
          },
        },
      ],
      85,
    );
    expect(summary.pointsEarned).toBe(3); // 2 + 1
    expect(summary.pointsPossible).toBe(4);
    expect(summary.correctCount).toBe(1); // only second fully correct
    expect(summary.accuracyPercent).toBe(50);
    expect(summary.metBenchmark).toBe(false);
  });
});

describe("timer", () => {
  it("computes endsAt and timeout", () => {
    const start = new Date("2026-11-25T10:00:00Z");
    const ends = computeEndsAt(start, 240);
    expect(ends.toISOString()).toBe("2026-11-25T14:00:00.000Z");
    expect(isTimedOut(ends, new Date("2026-11-25T14:00:00Z"))).toBe(true);
    expect(remainingMs(ends, new Date("2026-11-25T13:00:00Z"))).toBe(3_600_000);
  });
});

describe("2026 blueprint quotas", () => {
  it("allocates 150 items within tolerance of Client Needs ranges", () => {
    const plan = allocateBlueprintQuotas(150);
    const sum = Object.values(plan).reduce((a, b) => a + b, 0);
    expect(sum).toBe(150);
    expect(isWithinBlueprintTolerance(plan, 150)).toBe(true);
  });

  it("allocates 85 items", () => {
    const plan = allocateBlueprintQuotas(85);
    expect(Object.values(plan).reduce((a, b) => a + b, 0)).toBe(85);
  });
});
