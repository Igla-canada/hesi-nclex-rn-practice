export type MistakeFeedback = {
  versionId: string;
  correctAnswer: string;
  rationale: string;
  correctOptionIds: string[];
};

export type ReviewResponse = {
  disclaimer: string;
  counts: { correct: number; incorrect: number; unanswered: number };
  mistakes: MistakeFeedback[];
};
