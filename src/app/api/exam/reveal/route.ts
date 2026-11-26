import { NextResponse } from "next/server";
import { z } from "zod";
import { keysFromDatabase } from "@/lib/exam-review-db";
import { revealBankAnswer, type RevealedAnswer } from "@/lib/exam-review";

const bodySchema = z
  .object({
    id: z.string().min(1).max(200),
  })
  .strict();

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const fromBank = revealBankAnswer(parsed.data.id);
  let revealed: RevealedAnswer | null = fromBank;
  if (!revealed) {
    const stored = await keysFromDatabase([parsed.data.id]);
    const key = stored.get(parsed.data.id);
    if (key) {
      revealed = {
        id: parsed.data.id,
        correctAnswer: key.correctAnswer,
        rationale: key.rationale,
      };
    }
  }
  if (!revealed) {
    return NextResponse.json({ error: "Answer not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: revealed.id,
    correctAnswer: revealed.correctAnswer,
    rationale: revealed.rationale,
  });
}
