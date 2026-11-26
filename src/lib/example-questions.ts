import type { ClientExamQuestion } from "@/lib/exam-config";

/** Labeled placeholders used only when Postgres is empty or unreachable. */
export const EXAMPLE_QUESTIONS: ClientExamQuestion[] = [
  {
    id: "demo-1",
    versionId: "demo-v1",
    index: 0,
    stem: "[EXAMPLE — AWAITING CLINICAL REVIEW] Placeholder prioritization stem for exam UI wiring only.",
    questionType: "MULTIPLE_CHOICE",
    topic: "Management of Care",
    responseKind: "single",
    options: [
      { id: "o1", label: "A", text: "[Placeholder option A]" },
      { id: "o2", label: "B", text: "[Placeholder option B]" },
      { id: "o3", label: "C", text: "[Placeholder option C]" },
      { id: "o4", label: "D", text: "[Placeholder option D]" },
    ],
  },
  {
    id: "demo-2",
    versionId: "demo-v2",
    index: 1,
    stem: "[EXAMPLE — DRAFT] Select all that apply — placeholder SATA (no clinical claim).",
    questionType: "MULTIPLE_RESPONSE",
    topic: "Safety and Infection Prevention and Control",
    responseKind: "multi",
    options: [
      { id: "p1", label: "A", text: "[Placeholder selectable A]" },
      { id: "p2", label: "B", text: "[Placeholder selectable B]" },
      { id: "p3", label: "C", text: "[Placeholder selectable C]" },
      { id: "p4", label: "D", text: "[Placeholder selectable D]" },
    ],
  },
];

export function exampleQuestionsForSession(): ClientExamQuestion[] {
  return EXAMPLE_QUESTIONS.map((question, index) => ({ ...question, index }));
}
