import "server-only";

import { io } from "next/cache";
import type { Prisma } from "@prisma/client";
import { ExamMode, VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  isSessionModeId,
  SESSION_MODES,
  type ClientExamQuestion,
  type SessionModeId,
} from "@/lib/exam-config";
import { getCurrentUser } from "@/lib/session";
import { compiledSessionQuestions, loadCompiledItems } from "@/lib/compiled-bank";
import {
  BLUEPRINT_BY_CLIENT_NEEDS,
  buildCorrectJson,
  buildPresentation,
  clientQuestionFromStored,
  displayTopic,
  isSourceVerifiedPracticeItem,
  poolNotice,
  seededRng,
  selectSessionItems,
  type PoolNoticeInput,
} from "@/lib/exam-assemble";

const PRACTICE_SESSION_EMAIL = "practice-sessions@invalid.local";

export type PoolStatus = {
  source: "database" | "bank-file" | "example-fallback";
  reason: "ok" | "empty" | "unreachable";
  sourceVerifiedCount: number;
  approvedCount: number;
  byClientNeeds: Record<string, number>;
  notice: string;
};

export type LoadedExam = {
  attemptId: string;
  mode: SessionModeId;
  modeLabel: string;
  questions: ClientExamQuestion[];
  endsAtIso: string;
  allowBacktrack: boolean;
  notice: string;
  source: "database";
};

type BankRow = Prisma.QuestionGetPayload<{
  include: {
    options: true;
    correctAnswers: true;
    rationales: true;
    versions: { select: { id: true; versionNumber: true } };
  };
}>;

function fileBankStatus(): PoolStatus | null {
  try {
    const items = loadCompiledItems();
    if (items.length === 0) return null;
    const byClientNeeds: Record<string, number> = {};
    for (const item of items) {
      if (!item.clientNeeds) continue;
      byClientNeeds[item.clientNeeds] = (byClientNeeds[item.clientNeeds] ?? 0) + 1;
    }
    return {
      source: "bank-file",
      reason: "ok",
      sourceVerifiedCount: items.length,
      approvedCount: 0,
      byClientNeeds,
      notice: poolNotice({
        source: "bank-file",
        reason: "ok",
        sourceVerifiedCount: items.length,
        approvedCount: 0,
      }),
    };
  } catch (error) {
    console.error(
      "Compiled question bank could not be read:",
      error instanceof Error ? error.name : "error",
    );
    return null;
  }
}

function emptyStatus(reason: "empty" | "unreachable"): PoolStatus {
  return (
    fileBankStatus() ?? {
      source: "example-fallback",
      reason,
      sourceVerifiedCount: 0,
      approvedCount: 0,
      byClientNeeds: {},
      notice: poolNotice({ source: "example-fallback", reason }),
    }
  );
}

async function loadBankRows(): Promise<BankRow[]> {
  return prisma.question.findMany({
    where: {
      isExample: false,
      verificationStatus: VerificationStatus.SOURCE_VERIFIED,
    },
    include: {
      options: { orderBy: { sortOrder: "asc" } },
      correctAnswers: true,
      rationales: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1,
        select: { id: true, versionNumber: true },
      },
    },
    orderBy: { id: "asc" },
  });
}

export async function getPoolStatus(): Promise<PoolStatus> {
  await io();
  if (!process.env.DATABASE_URL) return emptyStatus("unreachable");
  try {
    const [sourceVerifiedCount, approvedCount, grouped] = await Promise.all([
      prisma.question.count({
        where: {
          isExample: false,
          verificationStatus: VerificationStatus.SOURCE_VERIFIED,
        },
      }),
      prisma.question.count({
        where: {
          verificationStatus: {
            in: [
              VerificationStatus.APPROVED,
              VerificationStatus.CLINICALLY_REVIEWED,
            ],
          },
        },
      }),
      prisma.question.groupBy({
        by: ["clientNeeds"],
        where: {
          isExample: false,
          verificationStatus: VerificationStatus.SOURCE_VERIFIED,
        },
        _count: { _all: true },
      }),
    ]);
    if (sourceVerifiedCount === 0) return emptyStatus("empty");
    const byClientNeeds: Record<string, number> = {};
    for (const row of grouped) {
      if (row.clientNeeds) byClientNeeds[row.clientNeeds] = row._count._all;
    }
    const status: PoolStatus = {
      source: "database",
      reason: "ok",
      sourceVerifiedCount,
      approvedCount,
      byClientNeeds,
      notice: poolNotice({
        source: "database",
        reason: "ok",
        sourceVerifiedCount,
        approvedCount,
      }),
    };
    return status;
  } catch (error) {
    console.error(
      "Question pool unavailable:",
      error instanceof Error ? error.name : "error",
    );
    return emptyStatus("unreachable");
  }
}

async function ownerId(): Promise<string> {
  try {
    const user = await getCurrentUser();
    if (user?.id) return user.id;
  } catch (error) {
    console.error(
      "Session lookup skipped:",
      error instanceof Error ? error.name : "error",
    );
  }
  const guest = await prisma.user.upsert({
    where: { email: PRACTICE_SESSION_EMAIL },
    update: {},
    create: {
      email: PRACTICE_SESSION_EMAIL,
      name: "Anonymous practice",
      role: "STUDENT",
    },
    select: { id: true },
  });
  return guest.id;
}

async function ensureVersion(row: BankRow): Promise<string> {
  if (!isSourceVerifiedPracticeItem(row)) {
    throw new Error("Practice sessions only snapshot source-verified items");
  }
  if (row.currentVersionId) return row.currentVersionId;
  const existing = row.versions[0];
  if (existing) {
    await prisma.question.update({
      where: { id: row.id },
      data: { currentVersionId: existing.id },
    });
    return existing.id;
  }

  const options = row.options.map((option) => ({
    id: option.id,
    label: option.label,
    text: option.text,
  }));
  const answerKeys = row.correctAnswers.map((answer) => answer.answerKey);
  const presentation = buildPresentation({
    questionType: row.questionType,
    options,
    answerKeys,
  });
  const correct = buildCorrectJson({
    questionType: row.questionType,
    scoringModel: row.scoringModel,
    options,
    answerRows: row.correctAnswers.map((answer) => ({
      optionId: answer.optionId,
      answerKey: answer.answerKey,
    })),
  });
  try {
    const version = await prisma.questionVersion.create({
      data: {
        questionId: row.id,
        versionNumber: 1,
        stem: row.stem,
        questionType: row.questionType,
        scoringModel: row.scoringModel,
        clientNeeds: row.clientNeeds,
        cjmmStep: row.cjmmStep,
        jurisdiction: row.jurisdiction,
        labUnitSystem: row.labUnitSystem,
        topic: row.topic,
        subcategory: row.subcategory,
        difficulty: row.difficulty,
        verificationStatus: row.verificationStatus,
        optionsJson: presentation as Prisma.InputJsonValue,
        correctJson: correct as Prisma.InputJsonValue,
        rationaleJson: {
          entries: row.rationales.map((rationale) => ({
            optionId: rationale.optionId,
            body: rationale.body,
          })),
        } as Prisma.InputJsonValue,
      },
      select: { id: true },
    });
    await prisma.question.update({
      where: { id: row.id },
      data: { currentVersionId: version.id },
    });
    return version.id;
  } catch (error) {
    const current = await prisma.question.findUnique({
      where: { id: row.id },
      select: {
        currentVersionId: true,
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
          select: { id: true },
        },
      },
    });
    const versionId = current?.currentVersionId ?? current?.versions[0]?.id;
    if (!versionId) throw error;
    if (!current?.currentVersionId) {
      await prisma.question.update({
        where: { id: row.id },
        data: { currentVersionId: versionId },
      });
    }
    return versionId;
  }
}

async function ensureVersions(rows: BankRow[]): Promise<Map<string, string>> {
  const ids = new Map<string, string>();
  const chunkSize = 20;
  for (let offset = 0; offset < rows.length; offset += chunkSize) {
    const chunk = rows.slice(offset, offset + chunkSize);
    const created = await Promise.all(
      chunk.map(async (row) => [row.id, await ensureVersion(row)] as const),
    );
    for (const [id, versionId] of created) ids.set(id, versionId);
  }
  return ids;
}

export type StartResult =
  | { kind: "started"; attemptId: string }
  | { kind: "fallback"; reason: "empty" | "unreachable" }
  | { kind: "no-match" };

export async function startSourceVerifiedSession(input: {
  mode: SessionModeId;
  clientNeeds?: string | null;
  count?: number;
}): Promise<StartResult> {
  await io();
  if (!process.env.DATABASE_URL) return { kind: "fallback", reason: "unreachable" };

  try {
    const rows = (await loadBankRows()).filter(isSourceVerifiedPracticeItem);
    if (rows.length === 0) return { kind: "fallback", reason: "empty" };

    const spec = SESSION_MODES[input.mode];
    const clientNeeds =
      input.clientNeeds && BLUEPRINT_BY_CLIENT_NEEDS[input.clientNeeds]
        ? input.clientNeeds
        : null;
    const requested =
      input.mode === "practice"
        ? clampPracticeCount(input.count ?? spec.questionCount)
        : spec.questionCount;
    const selected = selectSessionItems(
      rows,
      input.mode === "practice"
        ? { kind: "practice", count: requested, clientNeeds }
        : { kind: "blueprint", total: requested },
    );
    if (selected.length === 0) return { kind: "no-match" };

    const [versionIds, approvedCount, userId] = await Promise.all([
      ensureVersions(selected),
      prisma.question.count({
        where: {
          verificationStatus: {
            in: [
              VerificationStatus.APPROVED,
              VerificationStatus.CLINICALLY_REVIEWED,
            ],
          },
        },
      }),
      ownerId(),
    ]);
    const durationMinutes =
      input.mode === "practice"
        ? Math.min(240, Math.max(20, selected.length * 2))
        : spec.durationMinutes;
    const endsAt = new Date(Date.now() + durationMinutes * 60_000);
    const filters = {
      mode: input.mode,
      requested,
      delivered: selected.length,
      clientNeeds,
      sourceVerifiedCount: rows.length,
      approvedCount,
    } satisfies Prisma.InputJsonObject;

    const attempt = await prisma.attempt.create({
      data: {
        userId,
        mode: ExamMode[spec.examMode],
        questionCount: selected.length,
        durationMinutes,
        allowBacktrack: spec.allowBacktrack,
        includesUnverified: true,
        filtersJson: filters,
        endsAt,
        responses: {
          create: selected.map((row, index) => ({
            questionVersionId: versionIds.get(row.id)!,
            sortOrder: index,
          })),
        },
      },
      select: { id: true },
    });
    return { kind: "started", attemptId: attempt.id };
  } catch (error) {
    console.error(
      "Could not start a source-verified session:",
      error instanceof Error ? error.name : "error",
    );
    return { kind: "fallback", reason: "unreachable" };
  }
}

function clampPracticeCount(count: number): number {
  if (count === 10 || count === 20 || count === 40) return count;
  return 20;
}

type AttemptFilters = {
  mode?: string;
  requested?: number;
  clientNeeds?: string | null;
  sourceVerifiedCount?: number;
  approvedCount?: number;
};

function readFilters(value: Prisma.JsonValue | null): AttemptFilters {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const row = value as Record<string, Prisma.JsonValue>;
  return {
    mode: typeof row.mode === "string" ? row.mode : undefined,
    requested: typeof row.requested === "number" ? row.requested : undefined,
    clientNeeds: typeof row.clientNeeds === "string" ? row.clientNeeds : null,
    sourceVerifiedCount:
      typeof row.sourceVerifiedCount === "number" ? row.sourceVerifiedCount : undefined,
    approvedCount: typeof row.approvedCount === "number" ? row.approvedCount : undefined,
  };
}

export async function loadStoredAttempt(attemptId: string): Promise<LoadedExam | null> {
  await io();
  if (!process.env.DATABASE_URL) return null;
  if (!/^[a-z0-9]{8,40}$/i.test(attemptId)) return null;
  try {
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        responses: {
          orderBy: { sortOrder: "asc" },
          include: {
            questionVersion: {
              select: {
                id: true,
                questionId: true,
                stem: true,
                questionType: true,
                topic: true,
                subcategory: true,
                clientNeeds: true,
                optionsJson: true,
              },
            },
          },
        },
      },
    });
    if (!attempt || attempt.responses.length === 0) return null;
    const filters = readFilters(attempt.filtersJson);
    const mode: SessionModeId =
      filters.mode && isSessionModeId(filters.mode) ? filters.mode : "hesi150";
    const questions = attempt.responses.map((response, index) => {
      const version = response.questionVersion;
      return clientQuestionFromStored({
        id: version.questionId,
        versionId: version.id,
        index,
        stem: version.stem,
        questionType: version.questionType,
        topic: version.topic,
        subcategory: version.subcategory,
        clientNeeds: version.clientNeeds,
        optionsJson: version.optionsJson,
      });
    });
    const noticeInput: PoolNoticeInput = {
      source: "database",
      reason: "ok",
      sessionCount: questions.length,
      sourceVerifiedCount: filters.sourceVerifiedCount,
      approvedCount: filters.approvedCount ?? 0,
      requested: filters.requested,
    };
    return {
      attemptId: attempt.id,
      mode,
      modeLabel: SESSION_MODES[mode].label,
      questions,
      endsAtIso: (attempt.endsAt ?? new Date(Date.now() + attempt.durationMinutes * 60_000)).toISOString(),
      allowBacktrack: attempt.allowBacktrack,
      notice: poolNotice(noticeInput),
      source: "database",
    };
  } catch (error) {
    console.error(
      "Could not load exam attempt:",
      error instanceof Error ? error.name : "error",
    );
    return null;
  }
}

export type RenderedExam = {
  attemptId: string;
  mode: SessionModeId;
  modeLabel: string;
  questions: ClientExamQuestion[];
  allowBacktrack: boolean;
  durationMinutes: number;
  notice: string;
  source: PoolStatus["source"];
};

function sessionLength(mode: SessionModeId, count: number | undefined): number {
  const spec = SESSION_MODES[mode];
  return mode === "practice"
    ? clampPracticeCount(count ?? spec.questionCount)
    : spec.questionCount;
}

function clientQuestionFromRow(
  row: BankRow,
  index: number,
  rng: () => number,
): ClientExamQuestion {
  const options = row.options.map((option) => ({
    id: option.id,
    label: option.label,
    text: option.text,
  }));
  const presentation = buildPresentation(
    {
      questionType: row.questionType,
      options,
      answerKeys: row.correctAnswers.map((answer) => answer.answerKey),
    },
    rng,
  );
  return {
    id: row.id,
    versionId: row.currentVersionId ?? row.versions[0]?.id ?? row.id,
    index,
    stem: row.stem,
    questionType: row.questionType,
    topic: displayTopic(row.topic, row.subcategory, row.clientNeeds),
    ...presentation,
  };
}

async function databaseSessionQuestions(input: {
  mode: SessionModeId;
  clientNeeds: string | null;
  requested: number;
}): Promise<{ questions: ClientExamQuestion[]; bankCount: number; approvedCount: number } | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const [rows, approvedCount] = await Promise.all([
      loadBankRows(),
      prisma.question.count({
        where: {
          verificationStatus: {
            in: [
              VerificationStatus.APPROVED,
              VerificationStatus.CLINICALLY_REVIEWED,
            ],
          },
        },
      }),
    ]);
    const eligible = rows.filter(isSourceVerifiedPracticeItem);
    if (eligible.length === 0) return null;
    const seed = `db:${input.mode}:${input.clientNeeds ?? "all"}:${input.requested}`;
    const selected = selectSessionItems(
      eligible,
      input.mode === "practice"
        ? { kind: "practice", count: input.requested, clientNeeds: input.clientNeeds }
        : { kind: "blueprint", total: input.requested },
      seededRng(seed),
    );
    if (selected.length === 0) return null;
    return {
      bankCount: eligible.length,
      approvedCount,
      questions: selected.map((row, index) =>
        clientQuestionFromRow(row, index, seededRng(`${seed}:${row.id}`)),
      ),
    };
  } catch (error) {
    console.error(
      "Question database unavailable for this session:",
      error instanceof Error ? error.name : "error",
    );
    return null;
  }
}

/**
 * Read-only session for GET /exam?mode=. Prefers Postgres source-verified
 * rows, then the compiled question-bank file. Does not write an Attempt.
 */
export async function renderLiveSession(input: {
  mode: SessionModeId;
  clientNeeds?: string | null;
  count?: number;
}): Promise<RenderedExam> {
  await io();
  const spec = SESSION_MODES[input.mode];
  const clientNeeds =
    input.clientNeeds && BLUEPRINT_BY_CLIENT_NEEDS[input.clientNeeds]
      ? input.clientNeeds
      : null;
  const requested = sessionLength(input.mode, input.count);
  const durationMinutes =
    input.mode === "practice"
      ? Math.min(240, Math.max(20, requested * 2))
      : spec.durationMinutes;
  const fromDatabase = await databaseSessionQuestions({
    mode: input.mode,
    clientNeeds,
    requested,
  });
  if (fromDatabase) {
    return {
      attemptId: `database-${input.mode}-${clientNeeds ?? "all"}-${requested}`,
      mode: input.mode,
      modeLabel: spec.label,
      questions: fromDatabase.questions,
      allowBacktrack: spec.allowBacktrack,
      durationMinutes,
      source: "database",
      notice: poolNotice({
        source: "database",
        reason: "ok",
        sessionCount: fromDatabase.questions.length,
        sourceVerifiedCount: fromDatabase.bankCount,
        approvedCount: fromDatabase.approvedCount,
        requested,
      }),
    };
  }

  try {
    const questions = compiledSessionQuestions({
      mode: input.mode,
      total: requested,
      clientNeeds,
      blueprint: input.mode !== "practice",
    });
    if (questions.length > 0) {
      return {
        attemptId: `compiled-${input.mode}-${clientNeeds ?? "all"}-${requested}`,
        mode: input.mode,
        modeLabel: spec.label,
        questions,
        allowBacktrack: spec.allowBacktrack,
        durationMinutes,
        source: "bank-file",
        notice: poolNotice({
          source: "bank-file",
          reason: "ok",
          sessionCount: questions.length,
          sourceVerifiedCount: loadCompiledItems().length,
          approvedCount: 0,
          requested,
        }),
      };
    }
  } catch (error) {
    console.error(
      "Compiled question bank could not be read:",
      error instanceof Error ? error.name : "error",
    );
  }

  const { exampleQuestionsForSession } = await import("@/lib/example-questions");
  return {
    attemptId: `example-${input.mode}`,
    mode: input.mode,
    modeLabel: spec.label,
    questions: exampleQuestionsForSession(),
    allowBacktrack: spec.allowBacktrack,
    durationMinutes,
    source: "example-fallback",
    notice: poolNotice({
      source: "example-fallback",
      reason: process.env.DATABASE_URL ? "empty" : "unreachable",
    }),
  };
}

export function fallbackNotice(reason: "empty" | "unreachable"): string {
  return poolNotice({ source: "example-fallback", reason });
}
