import { NextResponse } from "next/server";
import { z } from "zod";
import { keysFromDatabase } from "@/lib/exam-review-db";
import { keyFromBank, type KeyedItem } from "@/lib/exam-review";
import { decidePracticeSubmission } from "@/lib/practice-stop-score";
import type { PracticeEnd } from "@/lib/practice-stop";

const answerSchema = z
  .object({
    selectedOptionIds: z.array(z.string()).optional(),
    ngnResponses: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
    numericValue: z.string().optional(),
  })
  .nullable();

const bodySchema = z.object({
  poolIds: z.array(z.string().min(1).max(200)).min(1).max(150),
  ended: z.enum(["advance", "time", "submit", "maximum"]),
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(200),
        versionId: z.string().min(1).max(200),
        answer: answerSchema,
      }),
    )
    .max(150),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { poolIds, items, ended } = parsed.data;
  if (new Set(poolIds).size !== poolIds.length) {
    return NextResponse.json({ error: "Repeated items" }, { status: 400 });
  }
  if (items.length > poolIds.length) {
    return NextResponse.json({ error: "Too many completed items" }, { status: 400 });
  }
  const prefix = items.every((item, index) => item.id === poolIds[index]);
  if (!prefix) {
    return NextResponse.json({ error: "Completed items must stay in pool order" }, { status: 400 });
  }

  const keys = new Map<string, KeyedItem>();
  const missing: string[] = [];
  for (const item of items) {
    const key = keyFromBank(item.id);
    if (key) keys.set(item.id, key);
    else missing.push(item.id);
  }
  if (missing.length > 0) {
    const stored = await keysFromDatabase(missing);
    for (const [id, key] of stored) keys.set(id, key);
  }

  const decision = decidePracticeSubmission({
    poolIds,
    items,
    ended: ended as PracticeEnd,
    keys,
  });
  return NextResponse.json(decision);
}
