import { NextResponse } from "next/server";
import { z } from "zod";
import { keysFromDatabase } from "@/lib/exam-review-db";
import { classifyReview, keyFromBank, type KeyedItem } from "@/lib/exam-review";

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(200),
        versionId: z.string().min(1).max(200),
        answer: z
          .object({
            selectedOptionIds: z.array(z.string()).optional(),
            ngnResponses: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
            numericValue: z.string().optional(),
          })
          .nullable(),
      }),
    )
    .max(200),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const keys = new Map<string, KeyedItem>();
  const missing: string[] = [];
  for (const item of parsed.data.items) {
    const key = keyFromBank(item.id);
    if (key) keys.set(item.id, key);
    else missing.push(item.id);
  }
  if (missing.length > 0) {
    const stored = await keysFromDatabase(missing);
    for (const [id, key] of stored) keys.set(id, key);
  }

  return NextResponse.json(classifyReview(parsed.data.items, keys));
}
