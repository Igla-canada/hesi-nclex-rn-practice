/**
 * Pure exam-session assembly. No database and no answer keys in the
 * client presentation. Clinically approved status is never assigned here.
 */
import {
  allocateBlueprintQuotas,
  CLIENT_NEEDS_2026,
  type ClientNeedsCategory,
} from "@/lib/blueprint";
import type {
  ClientChoice,
  ClientExamQuestion,
  ClientResponseKind,
} from "@/lib/exam-config";

export const BLUEPRINT_BY_CLIENT_NEEDS: Record<string, ClientNeedsCategory> = {
  MANAGEMENT_OF_CARE: "management_of_care",
  SAFETY_INFECTION_PREVENTION_CONTROL: "safety_infection_prevention_control",
  HEALTH_PROMOTION_MAINTENANCE: "health_promotion_maintenance",
  PSYCHOSOCIAL_INTEGRITY: "psychosocial_integrity",
  BASIC_CARE_COMFORT: "basic_care_comfort",
  PHARMACOLOGICAL_PARENTERAL: "pharmacological_parenteral",
  REDUCTION_OF_RISK_POTENTIAL: "reduction_of_risk_potential",
  PHYSIOLOGICAL_ADAPTATION: "physiological_adaptation",
};

const CLIENT_NEEDS_LABEL: Record<string, string> = Object.fromEntries(
  CLIENT_NEEDS_2026.map((category) => {
    const prismaName = Object.entries(BLUEPRINT_BY_CLIENT_NEEDS).find(
      ([, id]) => id === category.id,
    )?.[0];
    return [prismaName ?? category.id, category.label];
  }),
);

export function isSourceVerifiedPracticeItem(item: {
  isExample: boolean;
  verificationStatus: string;
}): boolean {
  return (
    item.isExample === false && item.verificationStatus === "SOURCE_VERIFIED"
  );
}

export function displayTopic(
  topic: string | null | undefined,
  subcategory: string | null | undefined,
  clientNeeds: string | null | undefined,
): string | null {
  if (subcategory && !subcategory.startsWith("ONRN-")) return subcategory;
  if (clientNeeds && CLIENT_NEEDS_LABEL[clientNeeds]) {
    return CLIENT_NEEDS_LABEL[clientNeeds]!;
  }
  if (topic && !topic.startsWith("ONRN-")) return topic;
  return null;
}

export function shuffleInPlace<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const current = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = current;
  }
  return copy;
}

export type SelectableItem = {
  id: string;
  clientNeeds: string | null;
};

export function selectSessionItems<T extends SelectableItem>(
  items: T[],
  spec:
    | { kind: "blueprint"; total: number }
    | { kind: "practice"; count: number; clientNeeds: string | null },
  rng: () => number = Math.random,
): T[] {
  if (spec.kind === "practice") {
    const filtered = spec.clientNeeds
      ? items.filter((item) => item.clientNeeds === spec.clientNeeds)
      : items;
    return shuffleInPlace(filtered, rng).slice(0, Math.max(0, spec.count));
  }

  const total = Math.max(0, spec.total);
  if (total === 0 || items.length === 0) return [];

  const quotas = allocateBlueprintQuotas(total);
  const buckets = new Map<ClientNeedsCategory, T[]>();
  for (const item of items) {
    const category = item.clientNeeds
      ? BLUEPRINT_BY_CLIENT_NEEDS[item.clientNeeds]
      : undefined;
    if (!category) continue;
    const bucket = buckets.get(category) ?? [];
    bucket.push(item);
    buckets.set(category, bucket);
  }

  const selected: T[] = [];
  const used = new Set<string>();
  for (const category of CLIENT_NEEDS_2026) {
    const bucket = shuffleInPlace(buckets.get(category.id) ?? [], rng);
    const take = bucket.slice(0, quotas[category.id]);
    for (const item of take) {
      selected.push(item);
      used.add(item.id);
    }
  }

  if (selected.length < total) {
    const pool = shuffleInPlace(
      items.filter((item) => !used.has(item.id)),
      rng,
    );
    for (const item of pool) {
      if (selected.length >= total) break;
      selected.push(item);
      used.add(item.id);
    }
  }

  return shuffleInPlace(selected, rng).slice(0, total);
}

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonObject;
  }
  return null;
}

function choiceList(value: unknown): ClientChoice[] {
  if (!Array.isArray(value)) return [];
  const choices: ClientChoice[] = [];
  for (const entry of value) {
    const row = asObject(entry);
    if (!row) continue;
    const id = typeof row.key === "string" ? row.key : "";
    const text = typeof row.text === "string" ? row.text : "";
    if (!id || !text) continue;
    choices.push({ id, label: id, text });
  }
  return choices;
}

export type AnswerRow = {
  optionId?: string | null;
  answerKey: unknown;
};

export type PresentationInput = {
  questionType: string;
  options: ClientChoice[];
  answerKeys: unknown[];
};

export type StoredPresentation = {
  responseKind: ClientResponseKind;
  options: ClientChoice[];
  matrix?: ClientExamQuestion["matrix"];
  cloze?: ClientExamQuestion["cloze"];
  bowtie?: ClientExamQuestion["bowtie"];
};

function readNgn(answerKeys: unknown[]): JsonObject | null {
  for (const key of answerKeys) {
    const row = asObject(key);
    const ngn = row ? asObject(row.ngn) : null;
    if (ngn) return ngn;
  }
  return null;
}

function isNumericKey(answerKeys: unknown[]): boolean {
  return answerKeys.some((key) => {
    const row = asObject(key);
    if (!row || row.ngn || row.key || row.order) return false;
    return typeof row.value === "number" || typeof row.value === "string";
  });
}

/**
 * Client-visible item shape. Drops `correct`, numeric values, and rationale text.
 * Ordered-response choices are shuffled so authored order is not the key.
 */
export function buildPresentation(
  input: PresentationInput,
  rng: () => number = Math.random,
): StoredPresentation {
  const ngn = readNgn(input.answerKeys);
  const options = input.options.map((option) => ({
    id: option.id,
    label: option.label,
    text: option.text,
  }));

  if (input.questionType === "NGN_MATRIX" && ngn) {
    const columns = Array.isArray(ngn.columns)
      ? ngn.columns.filter((column): column is string => typeof column === "string")
      : [];
    const rows = choiceList(ngn.rows);
    if (columns.length > 0 && rows.length > 0) {
      return { responseKind: "matrix", options: [], matrix: { columns, rows } };
    }
  }

  if (input.questionType === "NGN_CLOZE" && ngn) {
    const template = typeof ngn.template === "string" ? ngn.template : "";
    const blanksObj = asObject(ngn.blanks);
    const blanks = blanksObj
      ? Object.entries(blanksObj)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([id, choices]) => ({ id, choices: choiceList(choices) }))
          .filter((blank) => blank.choices.length > 0)
      : [];
    if (template && blanks.length > 0) {
      return { responseKind: "cloze", options: [], cloze: { template, blanks } };
    }
  }

  if (input.questionType === "NGN_BOW_TIE" && ngn) {
    const conditions = choiceList(ngn.conditions);
    const actions = choiceList(ngn.actions);
    const parameters = choiceList(ngn.parameters);
    if (conditions.length && actions.length && parameters.length) {
      return {
        responseKind: "bowtie",
        options: [],
        bowtie: { conditions, actions, parameters },
      };
    }
  }

  if (input.questionType === "NGN_DRAG_DROP" && options.length > 0) {
    return { responseKind: "order", options: shuffleInPlace(options, rng) };
  }

  if (input.questionType === "MULTIPLE_RESPONSE") {
    return { responseKind: "multi", options };
  }

  if (options.length === 0 && isNumericKey(input.answerKeys)) {
    return { responseKind: "numeric", options: [] };
  }

  return { responseKind: "single", options };
}

export type ServerCorrect = {
  method: "dichotomous" | "zero_one" | "plus_minus" | "rationale";
  pointsMax: number;
  correctOptionIds?: string[];
  ngnKey?: Record<string, string | string[]>;
};

function scoringMethod(model: string): ServerCorrect["method"] {
  if (model === "PLUS_MINUS") return "plus_minus";
  if (model === "RATIONALE") return "rationale";
  if (model === "DICHOTOMOUS") return "dichotomous";
  return "zero_one";
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

/**
 * Server-only scoring payload built from imported answer rows.
 * Callers must store this on QuestionVersion.correctJson and never send it.
 */
export function buildCorrectJson(input: {
  questionType: string;
  scoringModel: string;
  options: ClientChoice[];
  answerRows: AnswerRow[];
}): ServerCorrect {
  const method = scoringMethod(input.scoringModel);
  const byLabel = new Map(input.options.map((option) => [option.label, option.id]));
  const keys = new Set<string>();
  const optionIds = new Set<string>();
  let order: string[] | null = null;
  let ngnCorrect: JsonObject | null = null;
  let numeric: string | null = null;

  for (const row of input.answerRows) {
    if (row.optionId) optionIds.add(row.optionId);
    const key = asObject(row.answerKey);
    if (!key) continue;
    if (typeof key.key === "string") keys.add(key.key);
    if (Array.isArray(key.order)) order = stringList(key.order);
    if (key.correct && typeof key.correct === "object") {
      ngnCorrect = asObject(key.correct) ?? ngnCorrect;
      if (Array.isArray(key.correct)) order = stringList(key.correct);
    }
    if (
      numeric == null &&
      !key.ngn &&
      !key.key &&
      !key.order &&
      (typeof key.value === "number" || typeof key.value === "string")
    ) {
      numeric = String(key.value);
    }
  }

  for (const label of keys) {
    const optionId = byLabel.get(label);
    if (optionId) optionIds.add(optionId);
  }

  if (order && order.length > 0) {
    const orderedIds = order
      .map((label) => byLabel.get(label) ?? label)
      .filter((id) => id.length > 0);
    return {
      method: method === "plus_minus" ? method : "dichotomous",
      pointsMax: 1,
      correctOptionIds: orderedIds,
      ngnKey: { order: orderedIds },
    };
  }

  if (ngnCorrect) {
    const ngnKey: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(ngnCorrect)) {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        ngnKey[key] = String(value);
      } else if (Array.isArray(value)) {
        ngnKey[key] = stringList(value);
      }
    }
    const pointsMax =
      input.questionType === "NGN_BOW_TIE"
        ? 1 +
          (Array.isArray(ngnKey.actions) ? ngnKey.actions.length : 0) +
          (Array.isArray(ngnKey.parameters) ? ngnKey.parameters.length : 0)
        : Math.max(1, Object.keys(ngnKey).length);
    return { method: "zero_one", pointsMax, ngnKey };
  }

  if (numeric != null) {
    return {
      method: "dichotomous",
      pointsMax: 1,
      ngnKey: { value: numeric },
    };
  }

  const correctOptionIds = [...optionIds];
  const pointsMax =
    method === "plus_minus" ? Math.max(1, correctOptionIds.length) : 1;
  return { method, pointsMax, correctOptionIds };
}

export function clientQuestionFromStored(input: {
  id: string;
  versionId: string;
  index: number;
  stem: string;
  questionType: string;
  topic?: string | null;
  subcategory?: string | null;
  clientNeeds?: string | null;
  optionsJson: unknown;
}): ClientExamQuestion {
  const topic = displayTopic(input.topic, input.subcategory, input.clientNeeds);
  const base = {
    id: input.id,
    versionId: input.versionId,
    index: input.index,
    stem: input.stem,
    questionType: input.questionType,
    topic,
  };

  if (Array.isArray(input.optionsJson)) {
    const options = input.optionsJson.flatMap((entry) => {
      const row = asObject(entry);
      if (!row || typeof row.id !== "string" || typeof row.text !== "string") {
        return [];
      }
      return [
        {
          id: row.id,
          label: typeof row.label === "string" ? row.label : row.id,
          text: row.text,
        },
      ];
    });
    return {
      ...base,
      options,
      responseKind:
        input.questionType === "MULTIPLE_RESPONSE" ? "multi" : "single",
    };
  }

  const stored = asObject(input.optionsJson);
  if (!stored) {
    return { ...base, options: [], responseKind: "single" };
  }

  const responseKind = stored.responseKind;
  const kind: ClientResponseKind =
    responseKind === "single" ||
    responseKind === "multi" ||
    responseKind === "matrix" ||
    responseKind === "cloze" ||
    responseKind === "bowtie" ||
    responseKind === "order" ||
    responseKind === "numeric"
      ? responseKind
      : "single";

  return {
    ...base,
    responseKind: kind,
    options: Array.isArray(stored.options)
      ? clientQuestionFromStored({
          ...input,
          optionsJson: stored.options,
        }).options
      : [],
    matrix: asMatrix(stored.matrix),
    cloze: asCloze(stored.cloze),
    bowtie: asBowtie(stored.bowtie),
  };
}

function asChoice(value: unknown): ClientChoice | null {
  const row = asObject(value);
  if (!row || typeof row.id !== "string" || typeof row.text !== "string") return null;
  return {
    id: row.id,
    label: typeof row.label === "string" ? row.label : row.id,
    text: row.text,
  };
}

function asMatrix(value: unknown): ClientExamQuestion["matrix"] {
  const row = asObject(value);
  if (!row || !Array.isArray(row.columns) || !Array.isArray(row.rows)) return undefined;
  const columns = row.columns.filter((column): column is string => typeof column === "string");
  const rows = row.rows.flatMap((entry) => {
    const choice = asChoice(entry);
    return choice ? [choice] : [];
  });
  if (columns.length === 0 || rows.length === 0) return undefined;
  return { columns, rows };
}

function asCloze(value: unknown): ClientExamQuestion["cloze"] {
  const row = asObject(value);
  if (!row || typeof row.template !== "string" || !Array.isArray(row.blanks)) return undefined;
  const blanks = row.blanks.flatMap((entry) => {
    const blank = asObject(entry);
    if (!blank || typeof blank.id !== "string" || !Array.isArray(blank.choices)) return [];
    const choices = blank.choices.flatMap((choice) => {
      const parsed = asChoice(choice);
      return parsed ? [parsed] : [];
    });
    if (choices.length === 0) return [];
    return [{ id: blank.id, choices }];
  });
  if (blanks.length === 0) return undefined;
  return { template: row.template, blanks };
}

function asBowtie(value: unknown): ClientExamQuestion["bowtie"] {
  const row = asObject(value);
  if (!row) return undefined;
  const read = (key: string) =>
    Array.isArray(row[key])
      ? (row[key] as unknown[]).flatMap((entry) => {
          const choice = asChoice(entry);
          return choice ? [choice] : [];
        })
      : [];
  const conditions = read("conditions");
  const actions = read("actions");
  const parameters = read("parameters");
  if (!conditions.length || !actions.length || !parameters.length) return undefined;
  return { conditions, actions, parameters };
}

export function seededRng(key: string): () => number {
  let seed = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    seed ^= key.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type PoolNoticeInput = {
  source: "database" | "bank-file" | "example-fallback";
  reason: "ok" | "empty" | "unreachable";
  sessionCount?: number;
  sourceVerifiedCount?: number;
  approvedCount?: number;
  requested?: number;
};

export function poolNotice(input: PoolNoticeInput): string {
  if (input.source === "database" || input.source === "bank-file") {
    const parts = [
      input.sessionCount != null ? `${input.sessionCount} in this session` : null,
      input.sourceVerifiedCount != null
        ? `${input.sourceVerifiedCount} in the ${input.source === "bank-file" ? "question bank file" : "bank"}`
        : null,
    ].filter((part): part is string => part != null);
    const scope = parts.length > 0 ? ` (${parts.join(", ")})` : "";
    const approved = input.approvedCount ?? 0;
    const shortfall =
      input.requested != null &&
      input.sessionCount != null &&
      input.sessionCount < input.requested
        ? ` The bank could not fill the full ${input.requested}-item form, so this session is shorter.`
        : "";
    const where =
      input.source === "bank-file"
        ? " Supabase import is still pending, so this session is served from the question bank file, not Postgres."
        : "";
    const lead =
      input.source === "bank-file"
        ? "Source-verified practice items from the compiled question bank"
        : "Source-verified practice items";
    return `${lead}${scope}. Clinically approved: ${approved}.${where} This is not an official NCLEX or HESI exam.${shortfall}`;
  }
  if (input.reason === "empty") {
    return "Example items only. The question database has no source-verified practice items yet, so this session uses labeled placeholders.";
  }
  return "Example items only. The question database could not be reached, so this session uses labeled placeholders.";
}
