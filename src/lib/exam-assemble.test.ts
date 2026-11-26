import { describe, expect, it } from "vitest";
import { allocateBlueprintQuotas } from "./blueprint";
import {
  buildCorrectJson,
  buildPresentation,
  displayTopic,
  isSourceVerifiedPracticeItem,
  poolNotice,
  selectSessionItems,
} from "./exam-assemble";

function sequenceRng(values: number[]): () => number {
  let index = 0;
  return () => {
    const value = values[index] ?? 0;
    index += 1;
    return value;
  };
}

describe("source-verified practice eligibility", () => {
  it("accepts only non-example SOURCE_VERIFIED items", () => {
    expect(
      isSourceVerifiedPracticeItem({
        isExample: false,
        verificationStatus: "SOURCE_VERIFIED",
      }),
    ).toBe(true);
    for (const verificationStatus of [
      "APPROVED",
      "CLINICALLY_REVIEWED",
      "DRAFT",
      "AWAITING_CLINICAL_REVIEW",
    ]) {
      expect(
        isSourceVerifiedPracticeItem({ isExample: false, verificationStatus }),
      ).toBe(false);
    }
    expect(
      isSourceVerifiedPracticeItem({
        isExample: true,
        verificationStatus: "SOURCE_VERIFIED",
      }),
    ).toBe(false);
  });
});

describe("selectSessionItems", () => {
  const categories = [
    "MANAGEMENT_OF_CARE",
    "SAFETY_INFECTION_PREVENTION_CONTROL",
    "HEALTH_PROMOTION_MAINTENANCE",
    "PSYCHOSOCIAL_INTEGRITY",
    "BASIC_CARE_COMFORT",
    "PHARMACOLOGICAL_PARENTERAL",
    "REDUCTION_OF_RISK_POTENTIAL",
    "PHYSIOLOGICAL_ADAPTATION",
  ] as const;

  function bank(perCategory: number) {
    return categories.flatMap((clientNeeds) =>
      Array.from({ length: perCategory }, (_, index) => ({
        id: `${clientNeeds}-${index}`,
        clientNeeds,
      })),
    );
  }

  it("fills a blueprint exam from every Client Needs category", () => {
    const selected = selectSessionItems(bank(40), { kind: "blueprint", total: 85 }, () => 0.1);
    expect(selected).toHaveLength(85);
    const quotas = allocateBlueprintQuotas(85);
    const counts = Object.fromEntries(categories.map((id) => [id, 0])) as Record<
      (typeof categories)[number],
      number
    >;
    for (const item of selected) {
      counts[item.clientNeeds] += 1;
    }
    for (const [prismaName, blueprintId] of [
      ["MANAGEMENT_OF_CARE", "management_of_care"],
      ["SAFETY_INFECTION_PREVENTION_CONTROL", "safety_infection_prevention_control"],
      ["HEALTH_PROMOTION_MAINTENANCE", "health_promotion_maintenance"],
      ["PSYCHOSOCIAL_INTEGRITY", "psychosocial_integrity"],
      ["BASIC_CARE_COMFORT", "basic_care_comfort"],
      ["PHARMACOLOGICAL_PARENTERAL", "pharmacological_parenteral"],
      ["REDUCTION_OF_RISK_POTENTIAL", "reduction_of_risk_potential"],
      ["PHYSIOLOGICAL_ADAPTATION", "physiological_adaptation"],
    ] as const) {
      expect(counts[prismaName]).toBeGreaterThanOrEqual(quotas[blueprintId]);
    }
  });

  it("backfills when one category is short", () => {
    const items = bank(40).filter(
      (item) => item.clientNeeds !== "PSYCHOSOCIAL_INTEGRITY" || item.id.endsWith("-0"),
    );
    const selected = selectSessionItems(items, { kind: "blueprint", total: 85 }, () => 0.2);
    expect(selected).toHaveLength(85);
    expect(new Set(selected.map((item) => item.id)).size).toBe(85);
  });

  it("filters custom practice by Client Needs", () => {
    const selected = selectSessionItems(
      bank(5),
      { kind: "practice", count: 3, clientNeeds: "BASIC_CARE_COMFORT" },
      () => 0,
    );
    expect(selected).toHaveLength(3);
    expect(selected.every((item) => item.clientNeeds === "BASIC_CARE_COMFORT")).toBe(true);
  });
});

describe("client presentation strips answer keys", () => {
  it("keeps matrix choices and drops the correct map", () => {
    const sentinel = "CORRECT_SENTINEL_9f3a";
    const presentation = buildPresentation({
      questionType: "NGN_MATRIX",
      options: [],
      answerKeys: [
        {
          format: "matrix_multiple_choice",
          ngn: {
            columns: ["Indicated", "Not indicated"],
            rows: [{ key: "R1", text: "Give glucose tablets." }],
          },
          correct: { R1: sentinel },
        },
      ],
    });
    expect(presentation.responseKind).toBe("matrix");
    expect(JSON.stringify(presentation)).not.toContain(sentinel);
    expect(presentation.matrix?.rows[0]?.id).toBe("R1");
  });

  it("hides a calculation value", () => {
    const presentation = buildPresentation({
      questionType: "MULTIPLE_CHOICE",
      options: [],
      answerKeys: [{ value: 424242, unit: "mL" }],
    });
    expect(presentation.responseKind).toBe("numeric");
    expect(JSON.stringify(presentation)).not.toContain("424242");
    const correct = buildCorrectJson({
      questionType: "MULTIPLE_CHOICE",
      scoringModel: "DICHOTOMOUS",
      options: [],
      answerRows: [{ answerKey: { value: 424242, unit: "mL" } }],
    });
    expect(correct.ngnKey).toEqual({ value: "424242" });
  });

  it("shuffles ordered responses away from the keyed sequence", () => {
    const options = [
      { id: "id-b", label: "B", text: "Stop the transfusion." },
      { id: "id-c", label: "C", text: "Hang normal saline." },
      { id: "id-a", label: "A", text: "Notify the provider." },
      { id: "id-d", label: "D", text: "Document the event." },
    ];
    const presentation = buildPresentation(
      {
        questionType: "NGN_DRAG_DROP",
        options,
        answerKeys: [{ order: ["B", "C", "A", "D"] }],
      },
      sequenceRng([0, 0, 0]),
    );
    expect(presentation.responseKind).toBe("order");
    expect(presentation.options.map((option) => option.label)).not.toEqual([
      "B",
      "C",
      "A",
      "D",
    ]);
    const correct = buildCorrectJson({
      questionType: "NGN_DRAG_DROP",
      scoringModel: "DICHOTOMOUS",
      options,
      answerRows: [{ answerKey: { order: ["B", "C", "A", "D"] } }],
    });
    expect(correct.ngnKey?.order).toEqual(["id-b", "id-c", "id-a", "id-d"]);
    expect(JSON.stringify(presentation)).not.toContain("id-b,id-c,id-a,id-d");
  });

  it("maps multiple-choice keys to option ids for the server payload only", () => {
    const options = [
      { id: "opt-a", label: "A", text: "U waves" },
      { id: "opt-b", label: "B", text: "Peaked T waves" },
    ];
    const presentation = buildPresentation({
      questionType: "MULTIPLE_CHOICE",
      options,
      answerKeys: [{ key: "B" }],
    });
    expect(presentation.responseKind).toBe("single");
    expect(presentation.options.map((option) => option.id)).toEqual(["opt-a", "opt-b"]);
    const correct = buildCorrectJson({
      questionType: "MULTIPLE_CHOICE",
      scoringModel: "ZERO_ONE",
      options,
      answerRows: [{ optionId: "opt-b", answerKey: { key: "B" } }],
    });
    expect(correct.correctOptionIds).toEqual(["opt-b"]);
    expect(correct.pointsMax).toBe(1);
  });
});

describe("pool notice", () => {
  it("calls database items source-verified practice items", () => {
    const text = poolNotice({
      source: "database",
      reason: "ok",
      sessionCount: 85,
      sourceVerifiedCount: 750,
      approvedCount: 0,
    });
    expect(text).toContain("Source-verified practice items");
    expect(text).toContain("Clinically approved: 0");
    expect(text).not.toMatch(/clinically approved practice/i);
  });

  it("says the Supabase import is pending when the session comes from the file", () => {
    const text = poolNotice({
      source: "bank-file",
      reason: "ok",
      sessionCount: 85,
      sourceVerifiedCount: 750,
      approvedCount: 0,
    });
    expect(text).toContain("compiled question bank");
    expect(text).toContain("Supabase import is still pending");
    expect(text).toContain("Clinically approved: 0");
    expect(text).not.toContain("Example items only");
  });

  it("names the example fallback when the database is empty or down", () => {
    expect(
      poolNotice({ source: "example-fallback", reason: "empty" }),
    ).toContain("Example items only");
    expect(
      poolNotice({ source: "example-fallback", reason: "unreachable" }),
    ).toContain("could not be reached");
  });
});

describe("displayTopic", () => {
  it("prefers the Client Needs label over the bank id stored in topic", () => {
    expect(displayTopic("ONRN-PA-0001", "Physiological Adaptation", "PHYSIOLOGICAL_ADAPTATION")).toBe(
      "Physiological Adaptation",
    );
    expect(displayTopic("ONRN-PA-0001", null, "PHYSIOLOGICAL_ADAPTATION")).toBe(
      "Physiological Adaptation",
    );
  });
});
