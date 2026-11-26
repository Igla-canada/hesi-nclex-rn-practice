/**
 * Import compiled Ontario/Canada question bank into Postgres.
 *
 * Usage (requires DATABASE_URL):
 *   npx tsx scripts/import-question-bank.ts [path/to/question-bank.json]
 *
 * Default path: data/question-bank/question-bank.json
 *
 * Upserts by the bank question id. Running it again updates that row and
 * replaces its options, answers, rationales, and source links.
 * Maps author "Source verified" → Prisma SOURCE_VERIFIED.
 * Never sets CLINICALLY_REVIEWED / APPROVED. Never publishes exam forms.
 * isExample=false for bank items.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  PrismaClient,
  VerificationStatus,
  QuestionType,
  ScoringModel,
  ClientNeeds,
  CjmmStep,
  Jurisdiction,
  type Prisma,
} from "@prisma/client";
import {
  isTransactionPoolerUrl,
  prismaClientDatabaseUrl,
  redactSecrets,
} from "../src/lib/database-url";
import { safeVerificationStatus } from "../src/lib/question-bank-import";

type BankItem = {
  id: string;
  stem: string;
  format: string;
  scoring_model: string;
  options?: { key: string; text: string }[];
  ngn?: unknown;
  correct_answer: unknown;
  rationales?: Record<string, string>;
  client_needs_subcategory: string;
  cj_step?: string;
  jurisdiction?: string;
  topic?: string;
  difficulty?: string;
  verification_status: string;
  sources?: {
    title: string;
    publisher: string;
    url: string;
    section?: string;
    evidence?: string;
  }[];
};

type BankWriter = Pick<
  Prisma.TransactionClient,
  "question" | "option" | "correctAnswer" | "rationale" | "source" | "questionSource"
>;

const CLIENT_NEEDS: Record<string, string> = {
  "Management of Care": "MANAGEMENT_OF_CARE",
  "Safety and Infection Prevention and Control":
    "SAFETY_INFECTION_PREVENTION_CONTROL",
  "Health Promotion and Maintenance": "HEALTH_PROMOTION_MAINTENANCE",
  "Psychosocial Integrity": "PSYCHOSOCIAL_INTEGRITY",
  "Basic Care and Comfort": "BASIC_CARE_COMFORT",
  "Pharmacological and Parenteral Therapies": "PHARMACOLOGICAL_PARENTERAL",
  "Reduction of Risk Potential": "REDUCTION_OF_RISK_POTENTIAL",
  "Physiological Adaptation": "PHYSIOLOGICAL_ADAPTATION",
};

const CJMM: Record<string, string> = {
  "Recognize Cues": "RECOGNIZE_CUES",
  "Analyze Cues": "ANALYZE_CUES",
  "Prioritize Hypotheses": "PRIORITIZE_HYPOTHESES",
  "Generate Solutions": "GENERATE_SOLUTIONS",
  "Take Action": "TAKE_ACTION",
  "Evaluate Outcomes": "EVALUATE_OUTCOMES",
};

const FORMAT: Record<string, string> = {
  multiple_choice: "MULTIPLE_CHOICE",
  select_all_that_apply: "MULTIPLE_RESPONSE",
  matrix_multiple_choice: "NGN_MATRIX",
  bowtie: "NGN_BOW_TIE",
  drop_down_cloze: "NGN_CLOZE",
  ordered_response: "NGN_DRAG_DROP",
  calculation: "MULTIPLE_CHOICE",
};

const SCORING: Record<string, string> = {
  zero_one: "ZERO_ONE",
  plus_minus: "PLUS_MINUS",
  dichotomous: "DICHOTOMOUS",
  rationale: "RATIONALE",
};

const JURISDICTION: Record<string, string> = {
  "General (Canada/US concordant)": "UNIVERSAL",
  "Ontario-specific": "ONTARIO",
  "Canada-specific": "CANADA",
  "US-specific (labelled)": "UNITED_STATES",
};

const DIFFICULTY: Record<string, number> = {
  Easy: 2,
  Moderate: 3,
  Hard: 4,
};

type ImportCounts = { created: number; updated: number; skipped: number };

async function writeItem(
  writer: BankWriter,
  item: BankItem,
  sourceIds: Map<string, string>,
): Promise<"created" | "updated" | "skipped"> {
  const stem = item.stem?.trim();
  const questionId = item.id?.trim();
  if (!stem || !questionId) return "skipped";

  const verificationStatus = safeVerificationStatus(item.verification_status);
  if (
    verificationStatus === VerificationStatus.APPROVED ||
    verificationStatus === VerificationStatus.CLINICALLY_REVIEWED
  ) {
    throw new Error(`Refusing to import ${questionId} as ${verificationStatus}`);
  }

  const contentHash = crypto
    .createHash("sha256")
    .update(`${questionId}|${stem.toLowerCase()}`)
    .digest("hex");

  const data = {
    stem,
    contentHash,
    topic: questionId,
    subcategory: item.client_needs_subcategory,
    difficulty: DIFFICULTY[item.difficulty ?? ""] ?? 3,
    questionType:
      (FORMAT[item.format] as keyof typeof QuestionType) ??
      QuestionType.MULTIPLE_CHOICE,
    scoringModel:
      (SCORING[item.scoring_model] as keyof typeof ScoringModel) ??
      ScoringModel.DICHOTOMOUS,
    clientNeeds: (CLIENT_NEEDS[item.client_needs_subcategory] ??
      null) as keyof typeof ClientNeeds | null,
    cjmmStep: (item.cj_step ? CJMM[item.cj_step] : null) as keyof typeof CjmmStep | null,
    jurisdiction:
      (JURISDICTION[item.jurisdiction ?? ""] as keyof typeof Jurisdiction) ??
      Jurisdiction.UNIVERSAL,
    verificationStatus: verificationStatus as keyof typeof VerificationStatus,
    isExample: false,
  };

  const cast = {
    ...data,
    questionType: data.questionType as never,
    scoringModel: data.scoringModel as never,
    clientNeeds: data.clientNeeds as never,
    cjmmStep: data.cjmmStep as never,
    jurisdiction: data.jurisdiction as never,
    verificationStatus: data.verificationStatus as never,
  };

  const existing = await writer.question.findUnique({
    where: { id: questionId },
    select: { id: true },
  });

  // Earlier imports stored the bank id on topic and used a generated primary key.
  await writer.question.deleteMany({
    where: { topic: questionId, NOT: { id: questionId } },
  });

  await writer.question.upsert({
    where: { id: questionId },
    create: { id: questionId, ...cast },
    update: cast,
  });

  await writer.option.deleteMany({ where: { questionId } });
  await writer.correctAnswer.deleteMany({ where: { questionId } });
  await writer.rationale.deleteMany({ where: { questionId } });
  await writer.questionSource.deleteMany({ where: { questionId } });

  const optionIdByKey = new Map<string, string>();
  if (item.options?.length) {
    const rows = item.options.map((opt, index) => {
      const id = `${questionId}:option:${index}:${opt.key}`;
      optionIdByKey.set(opt.key, id);
      return {
        id,
        questionId,
        label: opt.key,
        text: opt.text,
        sortOrder: index,
      };
    });
    await writer.option.createMany({ data: rows });
  } else if (item.ngn) {
    await writer.correctAnswer.create({
      data: {
        id: `${questionId}:answer:ngn`,
        questionId,
        answerKey: {
          format: item.format,
          ngn: item.ngn,
          correct: item.correct_answer,
        } as Prisma.InputJsonValue,
        pointsMax: 1,
      },
    });
  }

  if (item.format === "ordered_response" && Array.isArray(item.correct_answer)) {
    await writer.correctAnswer.create({
      data: {
        id: `${questionId}:answer:order`,
        questionId,
        answerKey: { order: item.correct_answer } as Prisma.InputJsonValue,
        pointsMax: 1,
      },
    });
  } else if (Array.isArray(item.correct_answer)) {
    const rows = (item.correct_answer as string[]).map((key, index) => ({
      id: `${questionId}:answer:${index}:${key}`,
      questionId,
      optionId: optionIdByKey.get(key) ?? null,
      answerKey: { key } as Prisma.InputJsonValue,
      pointsMax: 1,
    }));
    if (rows.length) await writer.correctAnswer.createMany({ data: rows });
  } else if (
    item.correct_answer &&
    typeof item.correct_answer === "object" &&
    !item.ngn
  ) {
    await writer.correctAnswer.create({
      data: {
        id: `${questionId}:answer:payload`,
        questionId,
        answerKey: item.correct_answer as Prisma.InputJsonValue,
        pointsMax: 1,
      },
    });
  }

  if (item.rationales) {
    const rows = Object.entries(item.rationales).map(([key, body]) => ({
      id: `${questionId}:rationale:${key}`,
      questionId,
      body,
      optionId: optionIdByKey.get(key) ?? null,
    }));
    if (rows.length) await writer.rationale.createMany({ data: rows });
  }

  const links: { questionId: string; sourceId: string; citationNote: string | null }[] =
    [];
  const seenSources = new Set<string>();
  for (const src of item.sources ?? []) {
    let sourceId = sourceIds.get(src.url);
    if (!sourceId) {
      const found = await writer.source.findFirst({
        where: { url: src.url },
        select: { id: true },
      });
      if (found) {
        sourceId = found.id;
      } else {
        const created = await writer.source.create({
          data: {
            title: src.title,
            organization: src.publisher,
            url: src.url,
            licenseClass: "cite_link_only",
            notes: src.section
              ? `Section: ${src.section}. ${src.evidence ?? ""}`.slice(0, 2000)
              : src.evidence?.slice(0, 2000),
            lastVerifiedAt: new Date("2026-11-25"),
          },
          select: { id: true },
        });
        sourceId = created.id;
      }
      sourceIds.set(src.url, sourceId);
    }
    if (seenSources.has(sourceId)) continue;
    seenSources.add(sourceId);
    links.push({
      questionId,
      sourceId,
      citationNote: src.section ?? null,
    });
  }
  if (links.length) await writer.questionSource.createMany({ data: links });

  return existing ? "updated" : "created";
}

async function importItems(writer: BankWriter, items: BankItem[]): Promise<ImportCounts> {
  const counts: ImportCounts = { created: 0, updated: 0, skipped: 0 };
  const sourceIds = new Map<string, string>();
  for (const item of items) {
    const result = await writeItem(writer, item, sourceIds);
    counts[result] += 1;
    const done = counts.created + counts.updated;
    if (done > 0 && done % 50 === 0) {
      console.log(`Question bank import progress: ${done}/${items.length}`);
    }
  }
  return counts;
}

async function main() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const file =
    process.argv[2] ?? path.resolve("data/question-bank/question-bank.json");
  if (!fs.existsSync(file)) {
    console.error("Question bank file was not found");
    process.exit(1);
  }

  const databaseUrl = prismaClientDatabaseUrl(rawUrl);
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: [],
  });

  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
    items?: BankItem[];
    disclaimer?: string;
  };
  const items = raw.items ?? [];
  console.log(`Loaded ${items.length} items from the question bank file`);
  if (raw.disclaimer) console.log("Disclaimer:", raw.disclaimer);

  try {
    let counts: ImportCounts;
    if (isTransactionPoolerUrl(rawUrl)) {
      console.log(
        "Importing through the transaction pooler with prepared statements disabled.",
      );
      counts = await importItems(prisma, items);
    } else {
      console.log(`Importing ${items.length} questions in one transaction.`);
      try {
        counts = await prisma.$transaction((tx) => importItems(tx, items), {
          maxWait: 30_000,
          timeout: 600_000,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (!/transaction|timeout|P2028|prepared statement/i.test(message)) throw error;
        console.log(
          "Single-transaction import was not available. Importing one question at a time.",
        );
        counts = await importItems(prisma, items);
      }
    }

    const sourceVerified = await prisma.question.count({
      where: {
        isExample: false,
        verificationStatus: VerificationStatus.SOURCE_VERIFIED,
      },
    });
    const clinicallyApproved = await prisma.question.count({
      where: {
        verificationStatus: {
          in: [
            VerificationStatus.APPROVED,
            VerificationStatus.CLINICALLY_REVIEWED,
          ],
        },
      },
    });
    console.log(
      `Import done. created=${counts.created} updated=${counts.updated} skipped=${counts.skipped}. sourceVerified=${sourceVerified} clinicallyApproved=${clinicallyApproved}. Published exams unchanged (0).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : "import failed";
  console.error(redactSecrets(message));
  process.exit(1);
});
