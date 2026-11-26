/**
 * Practice stop rule for the NCLEX 85 exam.
 * Length follows the 2026 NCLEX-RN bounds (85–150, with 15 unscored items)
 * as a practice approximation. It is not the NCSBN logit and not the
 * 95% confidence interval rule.
 */
import {
  NCLEX85_CLEAR_MARGIN_POINTS,
  NCLEX85_MAX_ITEMS,
  NCLEX85_MIN_ITEMS,
  NCLEX85_PRACTICE_THRESHOLD_PERCENT,
  NCLEX85_PRETEST_ITEMS,
} from "@/lib/exam-config";
import { seededRng, shuffleInPlace } from "@/lib/exam-assemble";

export const PRACTICE_STOP_DISCLAIMER =
  "Practice stop rule, not an NCLEX pass. This is not the NCSBN passing standard, not a logit, and not the 95% confidence interval rule. Fifteen items in the exam are unscored pretest items and do not affect the stop decision. Scored items use the bank's partial credit: 0/1, plus/minus floored at 0, and rationale scoring. The practice threshold is 85% of points on scored items. After 85 items, the exam stops when that percent is 95% or higher, or 75% or lower. Between those lines the exam continues, up to 150 items. At 150, the practice rule is met at 85% or higher and not met below 85%. If the 180-minute clock hits 0 before 85 items are completed, the practice rule is not met. If the clock hits 0 after at least 85 items, every completed scored item is scored against 85%. The old last-60 rule is not used.";

export type PracticeEnd = "advance" | "time" | "submit" | "maximum";

export type PracticeStopReason =
  | "clearly-above"
  | "clearly-below"
  | "maximum-length"
  | "time-before-minimum"
  | "time-after-minimum"
  | "submitted-before-minimum"
  | "submitted"
  | "pool-short-of-minimum";

export type ScoredDelivery = {
  pretest: boolean;
  pointsEarned: number;
  pointsPossible: number;
};

export type PracticeStopResult = {
  action: "stop";
  outcome: "met" | "not-met";
  reason: PracticeStopReason;
  administered: number;
  scoredCount: number;
  pretestCount: number;
  pointsEarned: number;
  pointsPossible: number;
  scoredPercent: number;
  thresholdPercent: number;
  clearlyAbovePercent: number;
  clearlyBelowPercent: number;
  summary: string;
  disclaimer: string;
};

export type PracticeDecision =
  | { action: "continue"; administered: number }
  | PracticeStopResult;

const CLEARLY_ABOVE_PERCENT =
  NCLEX85_PRACTICE_THRESHOLD_PERCENT + NCLEX85_CLEAR_MARGIN_POINTS;
const CLEARLY_BELOW_PERCENT =
  NCLEX85_PRACTICE_THRESHOLD_PERCENT - NCLEX85_CLEAR_MARGIN_POINTS;

/**
 * Fifteen pretest slots, all inside the first 85 positions, stable for a pool order.
 * Later positions are scored. The candidate is not told which items these are.
 */
export function pretestFlags(itemIds: readonly string[]): boolean[] {
  const flags = itemIds.map(() => false);
  const span = Math.min(NCLEX85_MIN_ITEMS, itemIds.length);
  const count = Math.min(NCLEX85_PRETEST_ITEMS, span);
  if (count === 0) return flags;
  const rng = seededRng(`practice-pretest:v1:${itemIds.slice(0, span).join("\n")}`);
  const picked = shuffleInPlace(
    Array.from({ length: span }, (_, index) => index),
    rng,
  ).slice(0, count);
  for (const index of picked) flags[index] = true;
  return flags;
}

function roundPoints(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function displayPercent(earned: number, possible: number): number {
  if (possible <= 0) return 0;
  return Math.round((earned / possible) * 1000) / 10;
}

function percentAtLeast(earned: number, possible: number, percent: number): boolean {
  if (possible <= 0) return false;
  return earned * 100 >= possible * percent;
}

function percentAtMost(earned: number, possible: number, percent: number): boolean {
  if (possible <= 0) return true;
  return earned * 100 <= possible * percent;
}

function scoredStats(items: ScoredDelivery[]) {
  let pointsEarned = 0;
  let pointsPossible = 0;
  let scoredCount = 0;
  let pretestCount = 0;
  for (const item of items) {
    if (item.pretest) {
      pretestCount += 1;
      continue;
    }
    if (item.pointsPossible <= 0) continue;
    scoredCount += 1;
    pointsEarned += item.pointsEarned;
    pointsPossible += item.pointsPossible;
  }
  return {
    pointsEarned,
    pointsPossible,
    scoredCount,
    pretestCount,
    scoredPercent: displayPercent(pointsEarned, pointsPossible),
  };
}

function withSummary(result: Omit<PracticeStopResult, "summary">): PracticeStopResult {
  const points =
    result.pointsPossible > 0
      ? `${result.pointsEarned} / ${result.pointsPossible} scored points (${result.scoredPercent}%). Practice threshold ${result.thresholdPercent}%.`
      : "No scored points were available.";
  const summary = (() => {
    switch (result.reason) {
      case "clearly-above":
        return `The exam stopped at ${result.administered} items because the scored result was clearly above the practice threshold (at or above ${result.clearlyAbovePercent}%). ${points}`;
      case "clearly-below":
        return `The exam stopped at ${result.administered} items because the scored result was clearly below the practice threshold (at or below ${result.clearlyBelowPercent}%). ${points}`;
      case "maximum-length":
        return `The exam reached ${result.administered} items because the scored result stayed near the practice threshold. At the maximum, the practice rule is met at or above ${result.thresholdPercent}% of scored points. ${points}`;
      case "time-before-minimum":
        return `The 180-minute clock hit 0 before ${NCLEX85_MIN_ITEMS} items were completed. The practice rule is not met.`;
      case "time-after-minimum":
        return `The 180-minute clock hit 0 after ${result.administered} items. Every completed scored item was scored against the ${result.thresholdPercent}% practice threshold. The last-60 rule is not used. ${points}`;
      case "submitted-before-minimum":
        return `The exam was submitted before ${NCLEX85_MIN_ITEMS} items were completed. The practice rule is not met.`;
      case "submitted":
        return `The exam was submitted after ${result.administered} items. Completed scored items were scored against the ${result.thresholdPercent}% practice threshold. ${points}`;
      case "pool-short-of-minimum":
        return `The question pool ran out before ${NCLEX85_MIN_ITEMS} items. The practice rule is not met.`;
      default:
        return points;
    }
  })();
  return { ...result, summary };
}

function stopBase(
  delivered: ScoredDelivery[],
  reason: PracticeStopReason,
  outcome: "met" | "not-met",
): PracticeStopResult {
  const stats = scoredStats(delivered);
  return withSummary({
    action: "stop",
    outcome,
    reason,
    administered: delivered.length,
    scoredCount: stats.scoredCount,
    pretestCount: stats.pretestCount,
    pointsEarned: roundPoints(stats.pointsEarned),
    pointsPossible: roundPoints(stats.pointsPossible),
    scoredPercent: stats.scoredPercent,
    thresholdPercent: NCLEX85_PRACTICE_THRESHOLD_PERCENT,
    clearlyAbovePercent: CLEARLY_ABOVE_PERCENT,
    clearlyBelowPercent: CLEARLY_BELOW_PERCENT,
    disclaimer: PRACTICE_STOP_DISCLAIMER,
  });
}

/**
 * Decide whether a practice-length exam continues.
 * `delivered` is the completed prefix only. Pretest rows do not affect the percent.
 * Partial-credit points on scored rows do.
 */
export function evaluatePracticeLength(input: {
  delivered: ScoredDelivery[];
  ended: PracticeEnd;
  poolSize: number;
}): PracticeDecision {
  const delivered = input.delivered;
  const count = delivered.length;
  const cap = Math.min(NCLEX85_MAX_ITEMS, Math.max(0, input.poolSize));
  const stats = scoredStats(delivered);
  const met = percentAtLeast(
    stats.pointsEarned,
    stats.pointsPossible,
    NCLEX85_PRACTICE_THRESHOLD_PERCENT,
  );

  if (count < NCLEX85_MIN_ITEMS) {
    if (input.ended === "time") return stopBase(delivered, "time-before-minimum", "not-met");
    if (input.ended === "submit") {
      return stopBase(delivered, "submitted-before-minimum", "not-met");
    }
    if (count >= cap) return stopBase(delivered, "pool-short-of-minimum", "not-met");
    return { action: "continue", administered: count };
  }

  if (input.ended === "time") {
    return stopBase(delivered, "time-after-minimum", met ? "met" : "not-met");
  }

  if (count >= cap || input.ended === "maximum") {
    return stopBase(delivered, "maximum-length", met ? "met" : "not-met");
  }

  if (input.ended === "submit") {
    return stopBase(delivered, "submitted", met ? "met" : "not-met");
  }

  const clearlyAbove = percentAtLeast(
    stats.pointsEarned,
    stats.pointsPossible,
    CLEARLY_ABOVE_PERCENT,
  );
  const clearlyBelow = percentAtMost(
    stats.pointsEarned,
    stats.pointsPossible,
    CLEARLY_BELOW_PERCENT,
  );
  if (clearlyAbove) return stopBase(delivered, "clearly-above", "met");
  if (clearlyBelow) return stopBase(delivered, "clearly-below", "not-met");
  return { action: "continue", administered: count };
}
