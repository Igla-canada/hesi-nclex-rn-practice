import rawBank from "../../data/question-bank/question-bank.json";
import type { StoredAnswer } from "@/lib/exam-config";
import type { MistakeFeedback, ReviewResponse } from "@/lib/exam-followup";
import { scoreItem, type CorrectPayload, type StudentAnswer } from "@/lib/scoring";

export type { MistakeFeedback, ReviewResponse };

type BankChoice = { key: string; text: string };
type BankItem = {
  id: string;
  format: string;
  scoring_model?: string;
  options?: BankChoice[];
  ngn?: {
    rows?: BankChoice[];
    conditions?: BankChoice[];
    actions?: BankChoice[];
    parameters?: BankChoice[];
    blanks?: Record<string, BankChoice[]>;
  };
  correct_answer: unknown;
  rationales?: Record<string, string>;
};

const bankItems = ((rawBank as unknown as { items?: BankItem[] }).items ?? []).reduce(
  (map, item) => map.set(item.id, item),
  new Map<string, BankItem>(),
);

export type KeyedItem = {
  correct: CorrectPayload;
  correctAnswer: string;
  rationale: string;
  correctOptionIds: string[];
};

function choiceLabels(item: BankItem): Map<string, string> {
  const labels = new Map<string, string>();
  for (const option of item.options ?? []) labels.set(option.key, option.text);
  for (const group of [
    item.ngn?.rows,
    item.ngn?.conditions,
    item.ngn?.actions,
    item.ngn?.parameters,
  ]) {
    for (const choice of group ?? []) labels.set(choice.key, choice.text);
  }
  for (const choices of Object.values(item.ngn?.blanks ?? {})) {
    for (const choice of choices) labels.set(choice.key, choice.text);
  }
  return labels;
}

function rationaleText(rationales: Record<string, string> | undefined): string {
  if (!rationales) return "A rationale is not on file for this item.";
  const lines = Object.entries(rationales).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim().length > 0,
  );
  if (lines.length === 0) return "A rationale is not on file for this item.";
  return lines.map(([key, text]) => `${key}. ${text}`).join("\n");
}

export type RevealedAnswer = {
  id: string;
  correctAnswer: string;
  rationale: string;
};

/** Student-facing key for one item. Scoring fields stay on the server. */
export function revealBankAnswer(id: string): RevealedAnswer | null {
  const key = keyFromBank(id);
  if (!key) return null;
  return { id, correctAnswer: key.correctAnswer, rationale: key.rationale };
}

export function keyFromBank(id: string): KeyedItem | null {
  const item = bankItems.get(id);
  if (!item) return null;
  const labels = choiceLabels(item);
  const rationale = rationaleText(item.rationales);
  const model = item.scoring_model ?? "zero_one";
  const method: CorrectPayload["method"] =
    model === "plus_minus"
      ? "plus_minus"
      : model === "rationale"
        ? "rationale"
        : model === "dichotomous"
          ? "dichotomous"
          : "zero_one";
  const answer = item.correct_answer;

  if (Array.isArray(answer) && answer.every((entry) => typeof entry === "string")) {
    const ids = answer;
    const lines = ids.map((optionId, index) => {
      const text = labels.get(optionId);
      const body = text ? `${optionId}. ${text}` : optionId;
      return item.format === "ordered_response" ? `${index + 1}. ${body}` : body;
    });
    return {
      correct: {
        method: item.format === "ordered_response" ? "dichotomous" : method,
        pointsMax: method === "plus_minus" ? Math.max(1, ids.length) : 1,
        correctOptionIds: ids,
      },
      correctAnswer: lines.join("\n"),
      rationale,
      correctOptionIds: ids,
    };
  }

  if (answer && typeof answer === "object") {
    const record = answer as Record<string, unknown>;
    if (typeof record.value === "number" || typeof record.value === "string") {
      const value = String(record.value);
      const unit = typeof record.unit === "string" ? ` ${record.unit}` : "";
      return {
        correct: { method: "dichotomous", pointsMax: 1, ngnKey: { value } },
        correctAnswer: `${value}${unit}`,
        rationale,
        correctOptionIds: [],
      };
    }
    const ngnKey: Record<string, string | string[]> = {};
    const ids: string[] = [];
    const lines: string[] = [];
    for (const [key, value] of Object.entries(record)) {
      if (typeof value === "string") {
        ngnKey[key] = value;
        ids.push(value);
        const text = labels.get(value);
        lines.push(`${key}: ${text ? `${value}. ${text}` : value}`);
      } else if (Array.isArray(value) && value.every((entry) => typeof entry === "string")) {
        ngnKey[key] = value;
        ids.push(...value);
        const parts = value.map((optionId) => {
          const text = labels.get(optionId);
          return text ? `${optionId}. ${text}` : optionId;
        });
        lines.push(`${key}: ${parts.join("; ")}`);
      }
    }
    return {
      correct: { method: "zero_one", pointsMax: Math.max(1, Object.keys(ngnKey).length), ngnKey },
      correctAnswer: lines.join("\n"),
      rationale,
      correctOptionIds: ids,
    };
  }

  return {
    correct: { method, pointsMax: 1 },
    correctAnswer: "The answer key is not available for this item.",
    rationale,
    correctOptionIds: [],
  };
}

/** Bank keys are letters. Imported rows use ids like `ONRN-PA-0001:option:1:B`. */
export function canonicalOptionId(id: string): string {
  const marker = ":option:";
  const at = id.lastIndexOf(marker);
  if (at === -1) return id;
  const key = id.slice(at + marker.length).split(":").pop();
  return key && key.length > 0 ? key : id;
}

export function toStudentAnswer(answer: StoredAnswer | null): StudentAnswer | null {
  if (!answer) return null;
  const numeric = answer.numericValue?.trim();
  const selected = answer.selectedOptionIds?.map(canonicalOptionId);
  const ngn = answer.ngnResponses
    ? Object.fromEntries(
        Object.entries(answer.ngnResponses).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.map(canonicalOptionId) : canonicalOptionId(value),
        ]),
      )
    : undefined;
  if (!numeric) return { selectedOptionIds: selected, ngnResponses: ngn };
  return {
    selectedOptionIds: selected,
    ngnResponses: { ...(ngn ?? {}), value: numeric },
  };
}

function isBlank(answer: StudentAnswer | null): boolean {
  if (!answer) return true;
  const selected = answer.selectedOptionIds?.length ?? 0;
  const ngn = answer.ngnResponses ? Object.keys(answer.ngnResponses).length : 0;
  const pairs = answer.rationalePairs?.length ?? 0;
  return selected === 0 && ngn === 0 && pairs === 0;
}

export function classifyReview(
  items: Array<{ id: string; versionId: string; answer: StoredAnswer | null }>,
  keys: Map<string, KeyedItem>,
): ReviewResponse {
  const mistakes: MistakeFeedback[] = [];
  const counts = { correct: 0, incorrect: 0, unanswered: 0 };
  for (const item of items) {
    const key = keys.get(item.id);
    if (!key) continue;
    const student = toStudentAnswer(item.answer);
    if (isBlank(student)) {
      counts.unanswered += 1;
      continue;
    }
    const score = scoreItem(student, key.correct);
    if (score.isFullyCorrect) {
      counts.correct += 1;
      continue;
    }
    counts.incorrect += 1;
    mistakes.push({
      versionId: item.versionId,
      correctAnswer: key.correctAnswer,
      rationale: key.rationale,
      correctOptionIds: key.correctOptionIds,
    });
  }
  return {
    disclaimer:
      "Practice scoring only — not an official NCLEX or HESI result. No pass probability. Correct answers are shown after submission for items answered incorrectly.",
    counts,
    mistakes,
  };
}

export function reviewCompiledSubmission(
  items: Array<{ id: string; versionId: string; answer: StoredAnswer | null }>,
): ReviewResponse {
  const keys = new Map<string, KeyedItem>();
  for (const item of items) {
    const key = keyFromBank(item.id);
    if (key) keys.set(item.id, key);
  }
  return classifyReview(items, keys);
}
