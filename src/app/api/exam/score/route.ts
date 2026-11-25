import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreAttempt, type CorrectPayload, type StudentAnswer } from "@/lib/scoring";
import { PRACTICE_BENCHMARK_PERCENT } from "@/lib/exam-config";

/**
 * Server-side scoring endpoint.
 * Clients send student answers only; correct keys must be loaded server-side
 * (here accepted only for isolated unit/demo — production loads from QuestionVersion.correctJson).
 */
const bodySchema = z.object({
  items: z.array(
    z.object({
      answer: z
        .object({
          selectedOptionIds: z.array(z.string()).optional(),
          ngnResponses: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.boolean()])).optional(),
          rationalePairs: z
            .array(z.object({ left: z.string(), right: z.string() }))
            .optional(),
        })
        .nullable(),
      correct: z.object({
        method: z.enum(["dichotomous", "zero_one", "plus_minus", "rationale"]),
        correctOptionIds: z.array(z.string()).optional(),
        pointsMax: z.number().positive(),
        ngnKey: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.boolean()])).optional(),
        rationalePairs: z
          .array(z.object({ left: z.string(), right: z.string() }))
          .optional(),
      }),
    }),
  ),
  benchmarkPercent: z.number().min(0).max(100).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const summary = scoreAttempt(
    parsed.data.items.map((i) => ({
      answer: i.answer as StudentAnswer | null,
      correct: i.correct as CorrectPayload,
    })),
    parsed.data.benchmarkPercent ?? PRACTICE_BENCHMARK_PERCENT,
  );
  return NextResponse.json({
    ...summary,
    disclaimer:
      "Practice scoring only — not an official NCLEX or HESI result. No pass probability.",
  });
}
