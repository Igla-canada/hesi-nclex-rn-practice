import type { StoredAnswer } from "@/lib/exam-config";
import { toStudentAnswer, type KeyedItem } from "@/lib/exam-review";
import { scoreItem } from "@/lib/scoring";
import {
  evaluatePracticeLength,
  pretestFlags,
  type PracticeDecision,
  type PracticeEnd,
  type ScoredDelivery,
} from "@/lib/practice-stop";

export function scorePracticeDeliveries(
  poolIds: readonly string[],
  items: Array<{ id: string; answer: StoredAnswer | null }>,
  keys: Map<string, KeyedItem>,
): ScoredDelivery[] {
  const flags = pretestFlags(poolIds);
  return items.map((item, index) => {
    if (flags[index]) {
      return { pretest: true, pointsEarned: 0, pointsPossible: 0 };
    }
    const key = keys.get(item.id);
    if (!key) {
      return { pretest: false, pointsEarned: 0, pointsPossible: 1 };
    }
    const score = scoreItem(toStudentAnswer(item.answer), key.correct);
    return {
      pretest: false,
      pointsEarned: score.pointsEarned,
      pointsPossible: score.pointsPossible,
    };
  });
}

export function decidePracticeSubmission(input: {
  poolIds: readonly string[];
  items: Array<{ id: string; answer: StoredAnswer | null }>;
  ended: PracticeEnd;
  keys: Map<string, KeyedItem>;
}): PracticeDecision {
  return evaluatePracticeLength({
    delivered: scorePracticeDeliveries(input.poolIds, input.items, input.keys),
    ended: input.ended,
    poolSize: input.poolIds.length,
  });
}
