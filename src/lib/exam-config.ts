export const EXAM_DEFAULT_QUESTION_COUNT = Number(
  process.env.EXAM_DEFAULT_QUESTION_COUNT ?? 150,
);
export const EXAM_DEFAULT_DURATION_MINUTES = Number(
  process.env.EXAM_DEFAULT_DURATION_MINUTES ?? 240,
);
export const EXAM_EXTENDED_DURATION_MINUTES = Number(
  process.env.EXAM_EXTENDED_DURATION_MINUTES ?? 300,
);
export const PRACTICE_BENCHMARK_PERCENT = Number(
  process.env.NEXT_PUBLIC_PRACTICE_BENCHMARK_PERCENT ?? 85,
);

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "HESI RN & NCLEX-RN Practice";

export type ClientExamQuestion = {
  id: string;
  versionId: string;
  index: number;
  stem: string;
  questionType: string;
  topic?: string | null;
  options: Array<{ id: string; label: string; text: string }>;
  /** Never includes correct answers or rationales in Exam Mode */
};

export type LocalExamPersistence = {
  attemptId: string;
  currentIndex: number;
  flagged: string[];
  answers: Record<string, { selectedOptionIds?: string[] }>;
  updatedAt: string;
};

export const LOCAL_PERSIST_PREFIX = "hesi-exam-persist:";
