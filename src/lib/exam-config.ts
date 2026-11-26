export const EXAM_DEFAULT_QUESTION_COUNT = Number(
  process.env.EXAM_DEFAULT_QUESTION_COUNT ?? 150,
);
export const EXAM_DEFAULT_DURATION_MINUTES = Number(
  process.env.EXAM_DEFAULT_DURATION_MINUTES ?? 240,
);
export const EXAM_EXTENDED_DURATION_MINUTES = Number(
  process.env.EXAM_EXTENDED_DURATION_MINUTES ?? 300,
);
/** NCLEX-style 85 practice limit. The 150-item mode keeps the extended limit above. */
export const NCLEX85_DURATION_MINUTES = 180;
export const PRACTICE_BENCHMARK_PERCENT = Number(
  process.env.NEXT_PUBLIC_PRACTICE_BENCHMARK_PERCENT ?? 85,
);

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "HESI RN & NCLEX-RN Practice";

export type ClientChoice = { id: string; label: string; text: string };

export type ClientResponseKind =
  | "single"
  | "multi"
  | "matrix"
  | "cloze"
  | "bowtie"
  | "order"
  | "numeric";

/**
 * Safe to send to the browser in Exam Mode.
 * Must not include correct answers, rationales, or point keys.
 */
export type ClientExamQuestion = {
  id: string;
  versionId: string;
  index: number;
  stem: string;
  questionType: string;
  topic?: string | null;
  options: ClientChoice[];
  responseKind?: ClientResponseKind;
  matrix?: {
    columns: string[];
    rows: ClientChoice[];
  };
  cloze?: {
    template: string;
    blanks: Array<{ id: string; choices: ClientChoice[] }>;
  };
  bowtie?: {
    conditions: ClientChoice[];
    actions: ClientChoice[];
    parameters: ClientChoice[];
  };
};

export type StoredAnswer = {
  selectedOptionIds?: string[];
  ngnResponses?: Record<string, string | string[]>;
  numericValue?: string;
};

export type LocalExamPersistence = {
  attemptId: string;
  currentIndex: number;
  flagged: string[];
  /** Skipped items stay unanswered. Order defaults must not be filled in for these. */
  skipped?: string[];
  answers: Record<string, StoredAnswer>;
  updatedAt: string;
};

export type SessionModeId = "nclex85" | "nclex150" | "hesi150" | "practice";

export type SessionModeSpec = {
  id: SessionModeId;
  label: string;
  detail: string;
  examMode: "NCLEX_FIXED" | "HESI_STYLE" | "CUSTOM";
  questionCount: number;
  durationMinutes: number;
  allowBacktrack: boolean;
  blueprint: boolean;
};

export const SESSION_MODES: Record<SessionModeId, SessionModeSpec> = {
  nclex85: {
    id: "nclex85",
    label: "NCLEX-style fixed (85)",
    detail: "85 items · up to 3h · no backtrack",
    examMode: "NCLEX_FIXED",
    questionCount: 85,
    durationMinutes: NCLEX85_DURATION_MINUTES,
    allowBacktrack: false,
    blueprint: true,
  },
  nclex150: {
    id: "nclex150",
    label: "NCLEX-style fixed (150)",
    detail: "150 items · extended time · no backtrack",
    examMode: "NCLEX_FIXED",
    questionCount: 150,
    durationMinutes: EXAM_EXTENDED_DURATION_MINUTES,
    allowBacktrack: false,
    blueprint: true,
  },
  hesi150: {
    id: "hesi150",
    label: "HESI-style mock (150)",
    detail: "Fixed-form · 240 min default · public structure only",
    examMode: "HESI_STYLE",
    questionCount: 150,
    durationMinutes: EXAM_DEFAULT_DURATION_MINUTES,
    allowBacktrack: true,
    blueprint: true,
  },
  practice: {
    id: "practice",
    label: "Custom practice",
    detail: "Client Needs filter or a randomized set",
    examMode: "CUSTOM",
    questionCount: 20,
    durationMinutes: 40,
    allowBacktrack: true,
    blueprint: false,
  },
};

export function isSessionModeId(value: string): value is SessionModeId {
  return value in SESSION_MODES;
}

export const LOCAL_PERSIST_PREFIX = "hesi-exam-persist:";
