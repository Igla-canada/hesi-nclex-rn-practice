/**
 * Import compiled Ontario/Canada question bank into Postgres.
 *
 * Usage (requires DATABASE_URL):
 *   npx tsx scripts/import-question-bank.ts [path/to/question-bank.json]
 *
 * Default path: data/question-bank/question-bank.json
 *
 * Maps author "Source verified" → Prisma SOURCE_VERIFIED.
 * Never sets CLINICALLY_REVIEWED / APPROVED. Never publishes exam forms.
 * isExample=false for bank items.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { Prisma } from "@prisma/client";

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
  calculation: "MULTIPLE_CHOICE", // stored via correctAnswers.answerKey
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

const STATUS: Record<string, string> = {
  Draft: "DRAFT",
  "Source verified": "SOURCE_VERIFIED",
  "Awaiting clinical review": "AWAITING_CLINICAL_REVIEW",
  "Requires revision": "REQUIRES_REVISION",
  Archived: "ARCHIVED",
  // Never auto-map clinical statuses from AI bank files:
  "Clinically reviewed": "SOURCE_VERIFIED",
  Approved: "SOURCE_VERIFIED",
};

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const file =
    process.argv[2] ??
    path.resolve("data/question-bank/question-bank.json");
  if (!fs.existsSync(file)) {
    console.error("File not found:", file);
    process.exit(1);
  }

  const {
    PrismaClient,
    VerificationStatus,
    QuestionType,
    ScoringModel,
    ClientNeeds,
    CjmmStep,
    Jurisdiction,
  } = await import("@prisma/client");
  const prisma = new PrismaClient();

  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
    items?: BankItem[];
    disclaimer?: string;
  };
  const items = raw.items ?? [];
  console.log(`Loaded ${items.length} items from ${file}`);
  if (raw.disclaimer) console.log("Disclaimer:", raw.disclaimer);

  let created = 0;
  let skipped = 0;
  let updated = 0;

  for (const item of items) {
    const stem = item.stem?.trim();
    if (!stem) {
      skipped += 1;
      continue;
    }
    const contentHash = crypto
      .createHash("sha256")
      .update(`${item.id}|${stem.toLowerCase()}`)
      .digest("hex");

    const existing = await prisma.question.findFirst({
      where: { OR: [{ contentHash }, { topic: item.id }] },
    });

    const verificationStatus =
      (STATUS[item.verification_status] as keyof typeof VerificationStatus) ??
      VerificationStatus.DRAFT;
    // Hard stop: never import as clinically approved
    const safeStatus =
      verificationStatus === VerificationStatus.CLINICALLY_REVIEWED ||
      verificationStatus === VerificationStatus.APPROVED
        ? VerificationStatus.SOURCE_VERIFIED
        : (verificationStatus as typeof VerificationStatus.SOURCE_VERIFIED);

    const data = {
      stem,
      contentHash,
      topic: item.id,
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
      cjmmStep: (item.cj_step
        ? CJMM[item.cj_step]
        : null) as keyof typeof CjmmStep | null,
      jurisdiction:
        (JURISDICTION[item.jurisdiction ?? ""] as keyof typeof Jurisdiction) ??
        Jurisdiction.UNIVERSAL,
      verificationStatus: safeStatus,
      isExample: false,
    };

    if (existing) {
      await prisma.question.update({
        where: { id: existing.id },
        data: {
          ...data,
          questionType: data.questionType as never,
          scoringModel: data.scoringModel as never,
          clientNeeds: data.clientNeeds as never,
          cjmmStep: data.cjmmStep as never,
          jurisdiction: data.jurisdiction as never,
          verificationStatus: data.verificationStatus as never,
        },
      });
      updated += 1;
      continue;
    }

    const q = await prisma.question.create({
      data: {
        ...data,
        questionType: data.questionType as never,
        scoringModel: data.scoringModel as never,
        clientNeeds: data.clientNeeds as never,
        cjmmStep: data.cjmmStep as never,
        jurisdiction: data.jurisdiction as never,
        verificationStatus: data.verificationStatus as never,
      },
    });

    const optionIdByKey = new Map<string, string>();
    if (item.options?.length) {
      for (let i = 0; i < item.options.length; i++) {
        const opt = item.options[i];
        const createdOpt = await prisma.option.create({
          data: {
            questionId: q.id,
            label: opt.key,
            text: opt.text,
            sortOrder: i,
          },
        });
        optionIdByKey.set(opt.key, createdOpt.id);
      }
    } else if (item.ngn) {
      // `ngn` is the prompt the exam runner may show. `correct` stays server-side.
      await prisma.correctAnswer.create({
        data: {
          questionId: q.id,
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
      // One payload so the sequence survives import. Per-key rows would drop order.
      await prisma.correctAnswer.create({
        data: {
          questionId: q.id,
          answerKey: { order: item.correct_answer } as Prisma.InputJsonValue,
          pointsMax: 1,
        },
      });
    } else if (Array.isArray(item.correct_answer)) {
      for (const key of item.correct_answer as string[]) {
        await prisma.correctAnswer.create({
          data: {
            questionId: q.id,
            optionId: optionIdByKey.get(key) ?? null,
            answerKey: { key } as Prisma.InputJsonValue,
            pointsMax: 1,
          },
        });
      }
    } else if (
      item.correct_answer &&
      typeof item.correct_answer === "object" &&
      !item.ngn
    ) {
      await prisma.correctAnswer.create({
        data: {
          questionId: q.id,
          answerKey: item.correct_answer as Prisma.InputJsonValue,
          pointsMax: 1,
        },
      });
    }

    if (item.rationales) {
      for (const [key, body] of Object.entries(item.rationales)) {
        await prisma.rationale.create({
          data: {
            questionId: q.id,
            body,
            optionId: optionIdByKey.get(key) ?? null,
          },
        });
      }
    }

    for (const src of item.sources ?? []) {
      let source = await prisma.source.findFirst({ where: { url: src.url } });
      if (!source) {
        source = await prisma.source.create({
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
        });
      }
      await prisma.questionSource.create({
        data: {
          questionId: q.id,
          sourceId: source.id,
          citationNote: src.section ?? null,
        },
      });
    }

    created += 1;
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
    `Import done. created=${created} updated=${updated} skipped=${skipped}. sourceVerified=${sourceVerified} clinicallyApproved=${clinicallyApproved}. Published exams unchanged (0).`,
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
