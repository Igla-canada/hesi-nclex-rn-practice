import { describe, expect, it } from "vitest";
import { keyFromBank, toStudentAnswer } from "./exam-review";
import {
  NCLEX85_DURATION_MINUTES,
  NCLEX85_MAX_ITEMS,
  NCLEX85_MIN_ITEMS,
  NCLEX85_PRETEST_ITEMS,
  SESSION_MODES,
} from "./exam-config";
import {
  evaluatePracticeLength,
  PRACTICE_STOP_DISCLAIMER,
  pretestFlags,
  type ScoredDelivery,
} from "./practice-stop";
import { scorePracticeDeliveries } from "./practice-stop-score";
import { scoreItem, scorePlusMinus, scoreRationale, scoreZeroOne } from "./scoring";

function scored(count: number, earnedEach = 1, possibleEach = 1): ScoredDelivery[] {
  return Array.from({ length: count }, () => ({
    pretest: false,
    pointsEarned: earnedEach,
    pointsPossible: possibleEach,
  }));
}

function pretest(count: number): ScoredDelivery[] {
  return Array.from({ length: count }, () => ({
    pretest: true,
    pointsEarned: 0,
    pointsPossible: 1,
  }));
}

/** 15 pretest rows inside an 85-item prefix, then scored rows. Pretest points are ignored. */
function exam(scoredRows: ScoredDelivery[]): ScoredDelivery[] {
  const rows = [...pretest(NCLEX85_PRETEST_ITEMS), ...scoredRows];
  if (rows.length < NCLEX85_MIN_ITEMS) {
    throw new Error("fixture shorter than the minimum");
  }
  return rows;
}

describe("practice length configuration", () => {
  it("keeps the 180-minute clock and draws a 150-item pool", () => {
    expect(NCLEX85_DURATION_MINUTES).toBe(180);
    expect(SESSION_MODES.nclex85.durationMinutes).toBe(180);
    expect(SESSION_MODES.nclex85.questionCount).toBe(NCLEX85_MAX_ITEMS);
    expect(SESSION_MODES.nclex85.practiceLength).toBe(true);
    expect(SESSION_MODES.nclex85.allowBacktrack).toBe(false);
    expect(SESSION_MODES.nclex85.detail).toContain("3h");
    expect(SESSION_MODES.nclex150.practiceLength).toBe(false);
  });
});

describe("pretest slots", () => {
  const ids = Array.from({ length: 150 }, (_, index) => `item-${index}`);

  it("places 15 unscored items inside the first 85 and keeps them stable", () => {
    const flags = pretestFlags(ids);
    const indexes = flags.flatMap((flag, index) => (flag ? [index] : []));
    expect(indexes).toHaveLength(NCLEX85_PRETEST_ITEMS);
    expect(Math.max(...indexes)).toBeLessThan(NCLEX85_MIN_ITEMS);
    expect(pretestFlags(ids)).toEqual(flags);
    expect(flags.slice(NCLEX85_MIN_ITEMS).some(Boolean)).toBe(false);
  });
});

describe("practice stop rule", () => {
  it("states that the result is a practice stop rule and not an NCLEX pass", () => {
    expect(PRACTICE_STOP_DISCLAIMER).toContain("Practice stop rule, not an NCLEX pass");
    expect(PRACTICE_STOP_DISCLAIMER).toContain("not a logit");
    expect(PRACTICE_STOP_DISCLAIMER).toContain("not the 95% confidence interval rule");
    expect(PRACTICE_STOP_DISCLAIMER).toContain("last-60 rule is not used");
    expect(PRACTICE_STOP_DISCLAIMER).not.toContain("You passed the NCLEX");
  });

  it("stops at 85 when scored points are clearly above the practice threshold", () => {
    const delivered = exam([...scored(67), ...scored(3, 0)]);
    expect(delivered).toHaveLength(85);
    const decision = evaluatePracticeLength({
      delivered,
      ended: "advance",
      poolSize: 150,
    });
    expect(decision.action).toBe("stop");
    if (decision.action !== "stop") return;
    expect(decision.reason).toBe("clearly-above");
    expect(decision.outcome).toBe("met");
    expect(decision.administered).toBe(85);
    expect(decision.scoredCount).toBe(70);
    expect(decision.pretestCount).toBe(15);
    expect(decision.thresholdPercent).toBe(85);
    expect(decision.clearlyAbovePercent).toBe(95);
    expect(decision.clearlyBelowPercent).toBe(75);
    expect(decision.disclaimer).toBe(PRACTICE_STOP_DISCLAIMER);
    expect(decision.summary).toContain("clearly above");
  });

  it("stops at 85 when scored points are clearly below the practice threshold", () => {
    const decision = evaluatePracticeLength({
      delivered: exam(scored(70, 0)),
      ended: "advance",
      poolSize: 150,
    });
    expect(decision.action).toBe("stop");
    if (decision.action !== "stop") return;
    expect(decision.reason).toBe("clearly-below");
    expect(decision.outcome).toBe("not-met");
    expect(decision.scoredPercent).toBe(0);
  });

  it("continues past 85 when scored points stay near 85%", () => {
    const decision = evaluatePracticeLength({
      delivered: exam([...scored(60), ...scored(10, 0)]),
      ended: "advance",
      poolSize: 150,
    });
    expect(decision).toEqual({ action: "continue", administered: 85 });
  });

  it("ignores pretest items when deciding to stop", () => {
    const scoredRows = [...scored(67), ...scored(3, 0)];
    const withWrongPretest = exam(scoredRows).map((row) =>
      row.pretest ? { ...row, pointsEarned: 0, pointsPossible: 1 } : row,
    );
    const decision = evaluatePracticeLength({
      delivered: withWrongPretest,
      ended: "advance",
      poolSize: 150,
    });
    expect(decision.action).toBe("stop");
    if (decision.action !== "stop") return;
    expect(decision.reason).toBe("clearly-above");
    expect(decision.pointsEarned).toBe(67);
    expect(decision.pointsPossible).toBe(70);
  });

  it("does not stop before 85 items", () => {
    const decision = evaluatePracticeLength({
      delivered: exam(scored(70, 0)).slice(0, 84),
      ended: "advance",
      poolSize: 150,
    });
    expect(decision).toEqual({ action: "continue", administered: 84 });
  });

  it("ends as not met when the clock hits 0 before 85 items, even if those items were all correct", () => {
    const decision = evaluatePracticeLength({
      delivered: exam(scored(70)).slice(0, 84),
      ended: "time",
      poolSize: 150,
    });
    expect(decision.action).toBe("stop");
    if (decision.action !== "stop") return;
    expect(decision.reason).toBe("time-before-minimum");
    expect(decision.outcome).toBe("not-met");
    expect(decision.summary).toContain("clock hit 0");
    expect(decision.summary).not.toContain("last 60");
  });

  it("scores every completed scored item when time runs out after 85, including a near result", () => {
    const near = evaluatePracticeLength({
      delivered: exam([...scored(60), ...scored(10, 0), ...scored(10)]),
      ended: "time",
      poolSize: 150,
    });
    expect(near.action).toBe("stop");
    if (near.action !== "stop") return;
    expect(near.reason).toBe("time-after-minimum");
    expect(near.administered).toBe(95);
    expect(near.outcome).toBe("met");
    expect(near.summary).toContain("last-60 rule is not used");

    const below = evaluatePracticeLength({
      delivered: exam([...scored(56), ...scored(14, 0)]),
      ended: "time",
      poolSize: 150,
    });
    expect(below.action).toBe("stop");
    if (below.action !== "stop") return;
    expect(below.outcome).toBe("not-met");
    expect(below.reason).toBe("time-after-minimum");
  });

  it("does not let the last 60 items decide a timeout", () => {
    const earlyLow = [...scored(20), ...scored(55, 0)];
    const lastSixtyPerfect = scored(60);
    const lastSixtyFailsTheOldRule = evaluatePracticeLength({
      delivered: [...exam(earlyLow), ...lastSixtyPerfect],
      ended: "time",
      poolSize: 150,
    });
    expect(lastSixtyFailsTheOldRule.action).toBe("stop");
    if (lastSixtyFailsTheOldRule.action !== "stop") return;
    expect(lastSixtyFailsTheOldRule.administered).toBe(150);
    expect(lastSixtyFailsTheOldRule.pointsEarned).toBe(80);
    expect(lastSixtyFailsTheOldRule.pointsPossible).toBe(135);
    expect(lastSixtyFailsTheOldRule.outcome).toBe("not-met");

    const earlyPerfect = scored(75);
    const lastSixtyMediocre = [...scored(45), ...scored(15, 0)];
    const fullSetMeets = evaluatePracticeLength({
      delivered: [...exam(earlyPerfect), ...lastSixtyMediocre],
      ended: "time",
      poolSize: 150,
    });
    expect(fullSetMeets.action).toBe("stop");
    if (fullSetMeets.action !== "stop") return;
    expect(fullSetMeets.pointsEarned).toBe(120);
    expect(fullSetMeets.pointsPossible).toBe(135);
    expect(fullSetMeets.outcome).toBe("met");
  });

  it("at 150, meets the practice rule at or above 85% and does not meet it below 85%", () => {
    const met = evaluatePracticeLength({
      delivered: [...exam([...scored(115), ...scored(20, 0)])],
      ended: "maximum",
      poolSize: 150,
    });
    expect(met.action).toBe("stop");
    if (met.action !== "stop") return;
    expect(met.reason).toBe("maximum-length");
    expect(met.outcome).toBe("met");
    expect(met.pointsEarned).toBe(115);
    expect(met.pointsPossible).toBe(135);

    const missed = evaluatePracticeLength({
      delivered: exam([...scored(114), ...scored(21, 0)]),
      ended: "maximum",
      poolSize: 150,
    });
    expect(missed.action).toBe("stop");
    if (missed.action !== "stop") return;
    expect(missed.outcome).toBe("not-met");
    expect(missed.pointsEarned).toBe(114);
  });

  it("lets plus/minus partial credit move the early stop", () => {
    const partial = scorePlusMinus(
      { selectedOptionIds: ["A", "B", "C", "E"] },
      { method: "plus_minus", pointsMax: 4, correctOptionIds: ["A", "B", "C", "D"] },
    );
    const full = scorePlusMinus(
      { selectedOptionIds: ["A", "B", "C", "D"] },
      { method: "plus_minus", pointsMax: 4, correctOptionIds: ["A", "B", "C", "D"] },
    );
    expect(partial.pointsEarned).toBe(2);
    expect(partial.pointsPossible).toBe(4);
    expect(full.pointsEarned).toBe(4);

    const base = [...scored(66), ...scored(3, 0)];
    const withPartial = evaluatePracticeLength({
      delivered: exam([
        ...base,
        { pretest: false, pointsEarned: partial.pointsEarned, pointsPossible: partial.pointsPossible },
      ]),
      ended: "advance",
      poolSize: 150,
    });
    const withFull = evaluatePracticeLength({
      delivered: exam([
        ...base,
        { pretest: false, pointsEarned: full.pointsEarned, pointsPossible: full.pointsPossible },
      ]),
      ended: "advance",
      poolSize: 150,
    });
    expect(withPartial.action).toBe("continue");
    expect(withFull.action).toBe("stop");
    if (withFull.action !== "stop") return;
    expect(withFull.reason).toBe("clearly-above");
  });

  it("lets 0/1 cell credit and rationale credit feed the final percent", () => {
    const cells = scoreZeroOne(
      { ngnResponses: { a: "yes", b: "yes", c: "no", d: "no" } },
      {
        method: "zero_one",
        pointsMax: 4,
        ngnKey: { a: "yes", b: "yes", c: "yes", d: "no" },
      },
    );
    expect(cells.pointsEarned).toBe(3);
    expect(cells.pointsPossible).toBe(4);

    const pairs = scoreRationale(
      { rationalePairs: [{ left: "L1", right: "R1" }] },
      {
        method: "rationale",
        pointsMax: 2,
        rationalePairs: [
          { left: "L1", right: "R1" },
          { left: "L2", right: "R2" },
        ],
      },
    );
    expect(pairs.pointsEarned).toBe(1);
    expect(pairs.pointsPossible).toBe(2);

    const floored = scorePlusMinus(
      { selectedOptionIds: ["E", "F"] },
      { method: "plus_minus", pointsMax: 4, correctOptionIds: ["A", "B", "C", "D"] },
    );
    expect(floored.pointsEarned).toBe(0);

    const onePoint = [...scored(117), ...scored(15, 0)];
    const partialRows: ScoredDelivery[] = [
      { pretest: false, pointsEarned: cells.pointsEarned, pointsPossible: cells.pointsPossible },
      { pretest: false, pointsEarned: pairs.pointsEarned, pointsPossible: pairs.pointsPossible },
      { pretest: false, pointsEarned: floored.pointsEarned, pointsPossible: floored.pointsPossible },
    ];
    const withoutCredit = partialRows.map((row) => ({ ...row, pointsEarned: 0 }));
    const missed = evaluatePracticeLength({
      delivered: exam([...onePoint, ...withoutCredit]),
      ended: "maximum",
      poolSize: 150,
    });
    const decision = evaluatePracticeLength({
      delivered: exam([...onePoint, ...partialRows]),
      ended: "maximum",
      poolSize: 150,
    });
    expect(missed.action).toBe("stop");
    expect(decision.action).toBe("stop");
    if (missed.action !== "stop" || decision.action !== "stop") return;
    expect(decision.administered).toBe(150);
    expect(decision.pointsEarned).toBe(117 + 3 + 1);
    expect(decision.pointsPossible).toBe(132 + 4 + 2 + 4);
    expect(missed.outcome).toBe("not-met");
    expect(decision.outcome).toBe("met");
  });
});

describe("bank partial credit in the practice rule", () => {
  it("uses a compiled plus/minus item's points and ignores a pretest copy of it", () => {
    const key = keyFromBank("ONRN-SIPC-0001");
    expect(key).not.toBeNull();
    const partial = scoreItem(
      { selectedOptionIds: ["A", "B", "C", "E"] },
      key!.correct,
    );
    const full = scoreItem({ selectedOptionIds: ["A", "B", "C", "D"] }, key!.correct);
    expect(partial.method).toBe("plus_minus");
    expect(partial.pointsEarned).toBe(2);
    expect(full.pointsEarned).toBe(4);
    const importedIds = scoreItem(
      {
        selectedOptionIds: [
          "ONRN-SIPC-0001:option:0:A",
          "ONRN-SIPC-0001:option:1:B",
          "ONRN-SIPC-0001:option:2:C",
          "ONRN-SIPC-0001:option:3:D",
        ],
      },
      key!.correct,
    );
    expect(toStudentAnswer({
      selectedOptionIds: ["ONRN-SIPC-0001:option:3:D"],
    })?.selectedOptionIds).toEqual(["D"]);
    expect(scoreItem(
      toStudentAnswer({
        selectedOptionIds: [
          "ONRN-SIPC-0001:option:0:A",
          "ONRN-SIPC-0001:option:1:B",
          "ONRN-SIPC-0001:option:2:C",
          "ONRN-SIPC-0001:option:3:D",
        ],
      }),
      key!.correct,
    ).pointsEarned).toBe(4);
    expect(importedIds.pointsEarned).toBe(0);

    const keys = new Map([["ONRN-SIPC-0001", key!]]);
    const answer = { selectedOptionIds: ["A", "B", "C", "E"] };
    const asPretest = scorePracticeDeliveries(
      ["ONRN-SIPC-0001"],
      [{ id: "ONRN-SIPC-0001", answer }],
      keys,
    );
    expect(asPretest[0]?.pretest).toBe(true);
    expect(asPretest[0]?.pointsEarned).toBe(0);
    expect(asPretest[0]?.pointsPossible).toBe(0);

    const scoredPool = poolWhereFirstIsScored();
    const scoredDelivery = scorePracticeDeliveries(
      scoredPool,
      [{ id: "ONRN-SIPC-0001", answer }],
      keys,
    );
    expect(scoredDelivery[0]?.pretest).toBe(false);
    expect(scoredDelivery[0]?.pointsEarned).toBe(2);
    expect(scoredDelivery[0]?.pointsPossible).toBe(4);
  });
});

function poolWhereFirstIsScored(): string[] {
  for (let salt = 0; salt < 40; salt += 1) {
    const ids = [
      "ONRN-SIPC-0001",
      ...Array.from({ length: 84 }, (_, index) => `filler-${salt}-${index}`),
    ];
    if (!pretestFlags(ids)[0]) return ids;
  }
  throw new Error("expected a pool whose first item is scored");
}
