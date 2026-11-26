/**
 * Compiled question bank shipped in the repo.
 * Used when Postgres is empty or DATABASE_URL is not set.
 * Client questions never include correct answers or rationales.
 */
import rawBank from "../../data/question-bank/question-bank.json";
import {
  buildPresentation,
  seededRng,
  selectSessionItems,
} from "@/lib/exam-assemble";
import type { ClientChoice, ClientExamQuestion } from "@/lib/exam-config";

type BankOption = { key: string; text: string };
type BankItem = {
  id: string;
  stem: string;
  format: string;
  options?: BankOption[];
  ngn?: unknown;
  correct_answer: unknown;
  client_needs_subcategory: string;
};

const bank = rawBank as unknown as { items?: BankItem[]; disclaimer?: string };

const CLIENT_NEEDS_BY_LABEL: Record<string, string> = {
  "Management of Care": "MANAGEMENT_OF_CARE",
  "Safety and Infection Prevention and Control": "SAFETY_INFECTION_PREVENTION_CONTROL",
  "Health Promotion and Maintenance": "HEALTH_PROMOTION_MAINTENANCE",
  "Psychosocial Integrity": "PSYCHOSOCIAL_INTEGRITY",
  "Basic Care and Comfort": "BASIC_CARE_COMFORT",
  "Pharmacological and Parenteral Therapies": "PHARMACOLOGICAL_PARENTERAL",
  "Reduction of Risk Potential": "REDUCTION_OF_RISK_POTENTIAL",
  "Physiological Adaptation": "PHYSIOLOGICAL_ADAPTATION",
};

const FORMAT_TO_TYPE: Record<string, string> = {
  multiple_choice: "MULTIPLE_CHOICE",
  select_all_that_apply: "MULTIPLE_RESPONSE",
  matrix_multiple_choice: "NGN_MATRIX",
  bowtie: "NGN_BOW_TIE",
  drop_down_cloze: "NGN_CLOZE",
  ordered_response: "NGN_DRAG_DROP",
  calculation: "MULTIPLE_CHOICE",
};

export type CompiledItem = {
  id: string;
  stem: string;
  questionType: string;
  clientNeeds: string | null;
  topic: string | null;
  options: ClientChoice[];
  answerKeys: unknown[];
};

function answerKeysFor(item: BankItem): unknown[] {
  if (item.ngn) {
    return [{ format: item.format, ngn: item.ngn, correct: item.correct_answer }];
  }
  if (item.format === "ordered_response" && Array.isArray(item.correct_answer)) {
    return [{ order: item.correct_answer }];
  }
  if (Array.isArray(item.correct_answer)) {
    return item.correct_answer.map((key) => ({ key }));
  }
  if (item.correct_answer && typeof item.correct_answer === "object") {
    return [item.correct_answer];
  }
  return [];
}

let cached: CompiledItem[] | null = null;

export function loadCompiledItems(): CompiledItem[] {
  if (cached) return cached;
  cached = (bank.items ?? []).flatMap((item) => {
    const stem = item.stem?.trim();
    if (!stem) return [];
    const options = (item.options ?? []).map((option) => ({
      id: option.key,
      label: option.key,
      text: option.text,
    }));
    return [
      {
        id: item.id,
        stem,
        questionType: FORMAT_TO_TYPE[item.format] ?? "MULTIPLE_CHOICE",
        clientNeeds: CLIENT_NEEDS_BY_LABEL[item.client_needs_subcategory] ?? null,
        topic: item.client_needs_subcategory || null,
        options,
        answerKeys: answerKeysFor(item),
      },
    ];
  });
  return cached;
}

export function compiledClientQuestion(
  item: CompiledItem,
  index: number,
  rng: () => number = Math.random,
): ClientExamQuestion {
  const presentation = buildPresentation(
    {
      questionType: item.questionType,
      options: item.options,
      answerKeys: item.answerKeys,
    },
    rng,
  );
  return {
    id: item.id,
    versionId: `file-${item.id}`,
    index,
    stem: item.stem,
    questionType: item.questionType,
    topic: item.topic,
    ...presentation,
  };
}

export function compiledSessionQuestions(input: {
  mode: string;
  total: number;
  clientNeeds?: string | null;
  blueprint: boolean;
}): ClientExamQuestion[] {
  const items = loadCompiledItems();
  const seed = [
    input.mode,
    input.blueprint ? "blueprint" : "practice",
    input.clientNeeds ?? "all",
    String(input.total),
  ].join(":");
  const selected = selectSessionItems(
    items,
    input.blueprint
      ? { kind: "blueprint", total: input.total }
      : {
          kind: "practice",
          count: input.total,
          clientNeeds: input.clientNeeds ?? null,
        },
    seededRng(seed),
  );
  return selected.map((item, index) =>
    compiledClientQuestion(item, index, seededRng(`${seed}:${item.id}`)),
  );
}
