import "server-only";

import { prisma } from "@/lib/db";
import { buildCorrectJson, type ServerCorrect } from "@/lib/exam-assemble";
import type { KeyedItem } from "@/lib/exam-review";

function describeCorrect(
  correct: ServerCorrect,
  options: Array<{ id: string; label: string; text: string }>,
): { correctAnswer: string; correctOptionIds: string[] } {
  const byId = new Map(options.map((option) => [option.id, option]));
  if (correct.correctOptionIds?.length) {
    const lines = correct.correctOptionIds.map((id, index) => {
      const option = byId.get(id);
      const body = option ? `${option.label}. ${option.text}` : id;
      return correct.ngnKey?.order ? `${index + 1}. ${body}` : body;
    });
    return { correctAnswer: lines.join("\n"), correctOptionIds: correct.correctOptionIds };
  }
  if (correct.ngnKey) {
    const ids: string[] = [];
    const lines = Object.entries(correct.ngnKey).map(([key, value]) => {
      if (Array.isArray(value)) {
        ids.push(...value);
        return `${key}: ${value.join(", ")}`;
      }
      ids.push(value);
      return `${key}: ${value}`;
    });
    return { correctAnswer: lines.join("\n"), correctOptionIds: ids };
  }
  return { correctAnswer: "The answer key is not available for this item.", correctOptionIds: [] };
}

export async function keysFromDatabase(ids: string[]): Promise<Map<string, KeyedItem>> {
  const keys = new Map<string, KeyedItem>();
  if (!process.env.DATABASE_URL || ids.length === 0) return keys;
  try {
    const rows = await prisma.question.findMany({
      where: { id: { in: ids } },
      include: {
        options: { orderBy: { sortOrder: "asc" } },
        correctAnswers: true,
        rationales: true,
      },
    });
    for (const row of rows) {
      const options = row.options.map((option) => ({
        id: option.id,
        label: option.label,
        text: option.text,
      }));
      const correct = buildCorrectJson({
        questionType: row.questionType,
        scoringModel: row.scoringModel,
        options,
        answerRows: row.correctAnswers.map((answer) => ({
          optionId: answer.optionId,
          answerKey: answer.answerKey,
        })),
      });
      const described = describeCorrect(correct, options);
      const rationaleLines = row.rationales
        .map((rationale) => rationale.body.trim())
        .filter((body) => body.length > 0);
      keys.set(row.id, {
        correct,
        correctAnswer: described.correctAnswer,
        rationale:
          rationaleLines.join("\n") || "A rationale is not on file for this item.",
        correctOptionIds: described.correctOptionIds,
      });
    }
  } catch (error) {
    console.error(
      "Could not load answer keys for review:",
      error instanceof Error ? error.name : "error",
    );
  }
  return keys;
}
