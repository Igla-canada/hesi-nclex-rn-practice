/**
 * 2026 NCLEX-RN Client Needs percentage ranges
 * Source: https://www.nclex.com/files/2026_rn_test-plan.pdf
 * Effective April 1, 2026 – March 31, 2029
 *
 * Individual exams may vary ±3% per category (Test Plan).
 */

export type ClientNeedsCategory =
  | "management_of_care"
  | "safety_infection_prevention_control"
  | "health_promotion_maintenance"
  | "psychosocial_integrity"
  | "basic_care_comfort"
  | "pharmacological_parenteral"
  | "reduction_of_risk_potential"
  | "physiological_adaptation";

export type ClientNeedsBlueprint = {
  id: ClientNeedsCategory;
  label: string;
  /** Official low % inclusive */
  minPercent: number;
  /** Official high % inclusive */
  maxPercent: number;
  /** Chart midpoint used for sampling targets */
  avgPercent: number;
};

export const CLIENT_NEEDS_2026: readonly ClientNeedsBlueprint[] = [
  {
    id: "management_of_care",
    label: "Management of Care",
    minPercent: 15,
    maxPercent: 21,
    avgPercent: 18,
  },
  {
    id: "safety_infection_prevention_control",
    label: "Safety and Infection Prevention and Control",
    minPercent: 10,
    maxPercent: 16,
    avgPercent: 13,
  },
  {
    id: "health_promotion_maintenance",
    label: "Health Promotion and Maintenance",
    minPercent: 6,
    maxPercent: 12,
    avgPercent: 9,
  },
  {
    id: "psychosocial_integrity",
    label: "Psychosocial Integrity",
    minPercent: 6,
    maxPercent: 12,
    avgPercent: 9,
  },
  {
    id: "basic_care_comfort",
    label: "Basic Care and Comfort",
    minPercent: 6,
    maxPercent: 12,
    avgPercent: 9,
  },
  {
    id: "pharmacological_parenteral",
    label: "Pharmacological and Parenteral Therapies",
    minPercent: 13,
    maxPercent: 19,
    avgPercent: 16,
  },
  {
    id: "reduction_of_risk_potential",
    label: "Reduction of Risk Potential",
    minPercent: 9,
    maxPercent: 15,
    avgPercent: 12,
  },
  {
    id: "physiological_adaptation",
    label: "Physiological Adaptation",
    minPercent: 11,
    maxPercent: 17,
    avgPercent: 14,
  },
] as const;

/** Exam length / time from 2026 Candidate Bulletin / Test Plan */
export const NCLEX_MIN_ITEMS = 85;
export const NCLEX_MAX_ITEMS = 150;
export const NCLEX_TIME_HOURS = 5;
export const NCLEX_CASE_STUDIES = 3;
export const NCLEX_CASE_STUDY_ITEMS = 6; // 3 × 6 = 18
export const BLUEPRINT_TOLERANCE_PERCENT = 3;

export type QuotaPlan = Record<ClientNeedsCategory, number>;

/**
 * Allocate integer quotas that sum to `total` using midpoints,
 * then largest-remainder so percentages stay near avg and within range when possible.
 */
export function allocateBlueprintQuotas(total: number): QuotaPlan {
  const weights = CLIENT_NEEDS_2026.map((c) => c.avgPercent);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const raw = CLIENT_NEEDS_2026.map((c) => (c.avgPercent / weightSum) * total);
  const floors = raw.map((n) => Math.floor(n));
  let remaining = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((n, i) => ({ i, frac: n - floors[i]! }))
    .sort((a, b) => b.frac - a.frac);
  const counts = [...floors];
  for (const { i } of order) {
    if (remaining <= 0) break;
    counts[i]! += 1;
    remaining -= 1;
  }
  const plan = {} as QuotaPlan;
  CLIENT_NEEDS_2026.forEach((c, i) => {
    plan[c.id] = counts[i]!;
  });
  return plan;
}

export function quotaPercents(
  plan: QuotaPlan,
  total: number,
): Record<ClientNeedsCategory, number> {
  const out = {} as Record<ClientNeedsCategory, number>;
  for (const c of CLIENT_NEEDS_2026) {
    out[c.id] = total === 0 ? 0 : Math.round((plan[c.id] / total) * 1000) / 10;
  }
  return out;
}

/** True if each category is within official range ± BLUEPRINT_TOLERANCE_PERCENT. */
export function isWithinBlueprintTolerance(
  plan: QuotaPlan,
  total: number,
): boolean {
  if (total <= 0) return false;
  return CLIENT_NEEDS_2026.every((c) => {
    const pct = (plan[c.id] / total) * 100;
    return (
      pct >= c.minPercent - BLUEPRINT_TOLERANCE_PERCENT &&
      pct <= c.maxPercent + BLUEPRINT_TOLERANCE_PERCENT
    );
  });
}

export type CjmmStep =
  | "recognize_cues"
  | "analyze_cues"
  | "prioritize_hypotheses"
  | "generate_solutions"
  | "take_action"
  | "evaluate_outcomes";

export const CJMM_STEPS: Array<{ id: CjmmStep; label: string; order: number }> =
  [
    { id: "recognize_cues", label: "Recognize cues", order: 1 },
    { id: "analyze_cues", label: "Analyze cues", order: 2 },
    { id: "prioritize_hypotheses", label: "Prioritize hypotheses", order: 3 },
    { id: "generate_solutions", label: "Generate solutions", order: 4 },
    { id: "take_action", label: "Take action", order: 5 },
    { id: "evaluate_outcomes", label: "Evaluate outcomes", order: 6 },
  ];
