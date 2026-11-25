/**
 * Server-side scoring only.
 * Exam Mode clients never receive correct answers or this module's answer keys.
 *
 * Models align with public NCSBN scoring FAQ:
 * https://ncsbn.zendesk.com/hc/en-us/articles/14690447982359-What-are-the-current-scoring-models
 * - zero_one (0/1)
 * - plus_minus (+/−, floor at 0)
 * - rationale (both paired parts must be correct)
 * - dichotomous: alias of zero_one for classic single-key MCQ
 *
 * No HESI/NCLEX pass-probability claims.
 */

export type ScoringMethod =
  | "dichotomous"
  | "zero_one"
  | "plus_minus"
  | "rationale";

export type CorrectPayload = {
  method: ScoringMethod;
  /** Option ids (or keys) that are fully correct for MC/MR / SATA */
  correctOptionIds?: string[];
  /** Max points for this item (bowtie max 5 per NCSBN notes) */
  pointsMax: number;
  /** Optional NGN matrix / multi-part keys: { cellId: expectedValue } */
  ngnKey?: Record<string, string | string[] | boolean>;
  /**
   * Rationale pairs: each entry requires BOTH parts correct for the point.
   * Example: [{ left: "optA", right: "optX" }]
   */
  rationalePairs?: Array<{ left: string; right: string }>;
};

export type StudentAnswer = {
  selectedOptionIds?: string[];
  ngnResponses?: Record<string, string | string[] | boolean>;
  /** Selected pairs for rationale items: [{ left, right }] */
  rationalePairs?: Array<{ left: string; right: string }>;
};

export type ItemScore = {
  pointsEarned: number;
  pointsPossible: number;
  isFullyCorrect: boolean;
  method: ScoringMethod;
};

export type AttemptScoreSummary = {
  pointsEarned: number;
  pointsPossible: number;
  /** Share of fully-correct items — kept separate from points for NGN partial credit */
  accuracyPercent: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  benchmarkPercent: number;
  metBenchmark: boolean;
  items: ItemScore[];
};

export const DEFAULT_BENCHMARK_PERCENT = 85;

function setsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  return b.every((x) => sa.has(x));
}

function isUnanswered(answer: StudentAnswer | null | undefined): boolean {
  if (!answer) return true;
  const sel = answer.selectedOptionIds?.length ?? 0;
  const ngn = answer.ngnResponses
    ? Object.keys(answer.ngnResponses).length
    : 0;
  const pairs = answer.rationalePairs?.length ?? 0;
  return sel === 0 && ngn === 0 && pairs === 0;
}

/** 0/1 (and dichotomous): all-or-nothing / sum of correct cells with 0 for wrong. */
export function scoreZeroOne(
  answer: StudentAnswer,
  correct: CorrectPayload,
): ItemScore {
  const possible = correct.pointsMax;
  const key = correct.ngnKey ?? {};
  const keys = Object.keys(key);

  if (keys.length > 0) {
    const resp = answer.ngnResponses ?? {};
    let earned = 0;
    for (const k of keys) {
      const expected = key[k];
      const actual = resp[k];
      let match = false;
      if (Array.isArray(expected)) {
        const a = Array.isArray(actual)
          ? actual
          : actual != null
            ? [String(actual)]
            : [];
        match = setsEqual(a.map(String), expected.map(String));
      } else {
        match = actual === expected;
      }
      if (match) earned += 1;
    }
    // Cap at pointsMax (e.g. bowtie max 5)
    earned = Math.min(possible, earned);
    return {
      pointsEarned: earned,
      pointsPossible: possible,
      isFullyCorrect: earned === possible,
      method: correct.method === "dichotomous" ? "dichotomous" : "zero_one",
    };
  }

  const selected = answer.selectedOptionIds ?? [];
  const expected = correct.correctOptionIds ?? [];
  if (selected.length === 0 && expected.length > 0) {
    return {
      pointsEarned: 0,
      pointsPossible: possible,
      isFullyCorrect: false,
      method: correct.method === "dichotomous" ? "dichotomous" : "zero_one",
    };
  }
  const ok = setsEqual(selected, expected);
  return {
    pointsEarned: ok ? possible : 0,
    pointsPossible: possible,
    isFullyCorrect: ok,
    method: correct.method === "dichotomous" ? "dichotomous" : "zero_one",
  };
}

/** Legacy name → zero_one. */
export function scoreDichotomous(
  answer: StudentAnswer,
  correct: CorrectPayload,
): ItemScore {
  return scoreZeroOne(answer, { ...correct, method: "dichotomous" });
}

/**
 * +/− : +1 correct selection, −1 incorrect; floored at 0 (SATA / matrix MR).
 */
export function scorePlusMinus(
  answer: StudentAnswer,
  correct: CorrectPayload,
): ItemScore {
  const expected = new Set(correct.correctOptionIds ?? []);
  const selected = answer.selectedOptionIds ?? [];
  const possible = correct.pointsMax;
  let raw = 0;
  for (const id of selected) {
    raw += expected.has(id) ? 1 : -1;
  }
  const earned = Math.max(0, Math.min(possible, raw));
  return {
    pointsEarned: earned,
    pointsPossible: possible,
    isFullyCorrect: earned === possible && selected.length === expected.size,
    method: "plus_minus",
  };
}

/** @deprecated use scorePlusMinus */
export const scoreNgnPlusMinus = scorePlusMinus;
/** @deprecated use scoreZeroOne */
export const scoreNgnZeroOne = scoreZeroOne;

/**
 * Rationale: one point only if BOTH parts of each pair match.
 */
export function scoreRationale(
  answer: StudentAnswer,
  correct: CorrectPayload,
): ItemScore {
  const pairs = correct.rationalePairs ?? [];
  const possible = correct.pointsMax || pairs.length || 1;
  const selected = answer.rationalePairs ?? [];
  if (pairs.length === 0) {
    return {
      pointsEarned: 0,
      pointsPossible: possible,
      isFullyCorrect: false,
      method: "rationale",
    };
  }
  let earned = 0;
  for (const p of pairs) {
    const hit = selected.some((s) => s.left === p.left && s.right === p.right);
    if (hit) earned += 1;
  }
  earned = Math.min(possible, earned);
  return {
    pointsEarned: earned,
    pointsPossible: possible,
    isFullyCorrect: earned === pairs.length,
    method: "rationale",
  };
}

/** Partial aggregate helper kept for matrix fraction experiments (maps to 0/1 cells). */
export function scoreNgnPartial(
  answer: StudentAnswer,
  correct: CorrectPayload,
): ItemScore {
  // Prefer official models; partial fraction is expressed via plus_minus / zero_one sums.
  if (correct.method === "plus_minus") return scorePlusMinus(answer, correct);
  if (correct.method === "rationale") return scoreRationale(answer, correct);
  return scoreZeroOne(answer, correct);
}

export function scoreItem(
  answer: StudentAnswer | null | undefined,
  correct: CorrectPayload,
): ItemScore {
  if (!answer || isUnanswered(answer)) {
    return {
      pointsEarned: 0,
      pointsPossible: correct.pointsMax,
      isFullyCorrect: false,
      method: correct.method,
    };
  }
  switch (correct.method) {
    case "plus_minus":
      return scorePlusMinus(answer, correct);
    case "rationale":
      return scoreRationale(answer, correct);
    case "zero_one":
      return scoreZeroOne(answer, correct);
    case "dichotomous":
    default:
      return scoreDichotomous(answer, correct);
  }
}

/**
 * Aggregate attempt score. Accuracy % = fully-correct items / total;
 * points tracked separately for NGN partial credit.
 */
export function scoreAttempt(
  items: Array<{ answer: StudentAnswer | null; correct: CorrectPayload }>,
  benchmarkPercent: number = DEFAULT_BENCHMARK_PERCENT,
): AttemptScoreSummary {
  const scored = items.map((i) => scoreItem(i.answer, i.correct));
  const pointsEarned = scored.reduce((s, i) => s + i.pointsEarned, 0);
  const pointsPossible = scored.reduce((s, i) => s + i.pointsPossible, 0);
  const correctCount = scored.filter((i) => i.isFullyCorrect).length;
  const unansweredCount = items.filter((i) => isUnanswered(i.answer)).length;
  const incorrectCount = items.length - correctCount - unansweredCount;
  const accuracyPercent =
    items.length === 0
      ? 0
      : Math.round((correctCount / items.length) * 1000) / 10;
  return {
    pointsEarned: Math.round(pointsEarned * 1000) / 1000,
    pointsPossible: Math.round(pointsPossible * 1000) / 1000,
    accuracyPercent,
    correctCount,
    incorrectCount,
    unansweredCount,
    benchmarkPercent,
    metBenchmark: accuracyPercent >= benchmarkPercent,
    items: scored,
  };
}

export function remainingMs(endsAt: Date, now: Date = new Date()): number {
  return Math.max(0, endsAt.getTime() - now.getTime());
}

export function isTimedOut(endsAt: Date, now: Date = new Date()): boolean {
  return now.getTime() >= endsAt.getTime();
}

export function computeEndsAt(startedAt: Date, durationMinutes: number): Date {
  return new Date(startedAt.getTime() + durationMinutes * 60_000);
}
