"use server";

import { redirect } from "next/navigation";
import { BLUEPRINT_BY_CLIENT_NEEDS } from "@/lib/exam-assemble";
import { isSessionModeId } from "@/lib/exam-config";
import { startSourceVerifiedSession } from "@/lib/exam-session";

export async function startExam(formData: FormData) {
  const modeRaw = String(formData.get("mode") ?? "");
  if (!isSessionModeId(modeRaw)) redirect("/exams");

  const clientNeedsRaw = String(formData.get("clientNeeds") ?? "");
  const clientNeeds = BLUEPRINT_BY_CLIENT_NEEDS[clientNeedsRaw] ? clientNeedsRaw : null;
  const countRaw = Number(formData.get("count"));
  const result = await startSourceVerifiedSession({
    mode: modeRaw,
    clientNeeds,
    count: Number.isFinite(countRaw) ? countRaw : undefined,
  });

  if (result.kind === "no-match") redirect("/practice?none=1");
  if (result.kind === "fallback") {
    const params = new URLSearchParams({ mode: modeRaw });
    if (clientNeeds) params.set("clientNeeds", clientNeeds);
    if (modeRaw === "practice" && Number.isFinite(countRaw)) {
      params.set("count", String(countRaw));
    }
    redirect(`/exam?${params.toString()}`);
  }
  redirect(`/exam?attempt=${result.attemptId}`);
}
