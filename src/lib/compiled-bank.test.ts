import { describe, expect, it } from "vitest";
import {
  compiledClientQuestion,
  compiledSessionQuestions,
  loadCompiledItems,
} from "@/lib/compiled-bank";

const RATIONALE_SENTENCE = "usually the first visible ECG change";

describe("compiled question bank", () => {
  it("loads the 750 source-verified items from the question bank file", () => {
    const items = loadCompiledItems();
    expect(items).toHaveLength(750);
    expect(items.every((item) => item.stem.length > 0)).toBe(true);
    expect(items.some((item) => item.stem.startsWith("[EXAMPLE"))).toBe(false);
  });

  it("builds a stable 85-item NCLEX session without example placeholders", () => {
    const first = compiledSessionQuestions({
      mode: "nclex85",
      total: 85,
      blueprint: true,
    });
    const second = compiledSessionQuestions({
      mode: "nclex85",
      total: 85,
      blueprint: true,
    });
    expect(first).toHaveLength(85);
    expect(first.map((item) => item.id)).toEqual(second.map((item) => item.id));
    expect(first.some((item) => item.stem.startsWith("[EXAMPLE"))).toBe(false);
    expect(JSON.stringify(first)).not.toContain(RATIONALE_SENTENCE);
    expect(JSON.stringify(first)).not.toContain("correct_answer");
  });

  it("keeps the potassium ECG rationale off the client item", () => {
    const item = loadCompiledItems().find((row) => row.id === "ONRN-PA-0001");
    expect(item).toBeTruthy();
    const client = compiledClientQuestion(item!, 0, () => 0);
    const payload = JSON.stringify(client);
    expect(client.stem).toContain("serum potassium");
    expect(payload).toContain("Tall, narrow, peaked T waves");
    expect(payload).not.toContain(RATIONALE_SENTENCE);
    expect(payload).not.toContain("correct_answer");
    expect(client).not.toHaveProperty("answerKeys");
  });
});
