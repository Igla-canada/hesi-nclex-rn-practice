/**
 * Seed EXAMPLE / AWAITING REVIEW items only.
 * Do NOT invent clinical facts. Stems are clearly labeled placeholders.
 * Max ~10 example questions. Published/verified count remains 0.
 */
import { PrismaClient, VerificationStatus, ScoringModel, ClientNeeds, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

const SOURCES = [
  {
    title: "2026 NCLEX-RN Test Plan",
    organization: "NCSBN",
    url: "https://www.nclex.com/files/2026_rn_test-plan.pdf",
    licenseClass: "cite_structure_only",
    notes: "Blueprint / Client Needs structure. Do not copy sample items into commercial bank.",
  },
  {
    title: "NCSBN scoring models FAQ",
    organization: "NCSBN",
    url: "https://ncsbn.zendesk.com/hc/en-us/articles/14690447982359-What-are-the-current-scoring-models",
    licenseClass: "cite_link_only",
    notes: "0/1, +/−, rationale models for practice scoring.",
  },
  {
    title: "College of Nurses of Ontario",
    organization: "CNO",
    url: "https://www.cno.org",
    licenseClass: "cite_link_only",
    notes: "Commercial republication of standards needs CNO consent — prefer cite/link.",
  },
  {
    title: "CDC Use of Agency Materials",
    organization: "CDC",
    url: "https://www.cdc.gov",
    licenseClass: "public_domain_us",
    notes: "Most CDC materials U.S. public domain with attribution; prefer current links.",
  },
  {
    title: "DailyMed",
    organization: "NLM",
    url: "https://dailymed.nlm.nih.gov",
    licenseClass: "nlm_terms",
    notes: "Attribute NLM; keep labeling current.",
  },
];

/** Placeholder stems — NOT clinically authoritative. verification = DRAFT / AWAITING_CLINICAL_REVIEW */
const EXAMPLES = [
  {
    stem: "[EXAMPLE — AWAITING CLINICAL REVIEW] A nurse is prioritizing care for four assigned clients. Which client should the nurse assess first? (Placeholder stem — replace after clinical review.)",
    clientNeeds: ClientNeeds.MANAGEMENT_OF_CARE,
    scoringModel: ScoringModel.DICHOTOMOUS,
    options: [
      { label: "A", text: "[Placeholder option A]" },
      { label: "B", text: "[Placeholder option B]" },
      { label: "C", text: "[Placeholder option C]" },
      { label: "D", text: "[Placeholder option D]" },
    ],
    correctLabel: "A",
  },
  {
    stem: "[EXAMPLE — AWAITING CLINICAL REVIEW] Which action best demonstrates infection prevention during a routine procedure? (Placeholder — no clinical claim.)",
    clientNeeds: ClientNeeds.SAFETY_INFECTION_PREVENTION_CONTROL,
    scoringModel: ScoringModel.DICHOTOMOUS,
    options: [
      { label: "A", text: "[Placeholder option A]" },
      { label: "B", text: "[Placeholder option B]" },
      { label: "C", text: "[Placeholder option C]" },
      { label: "D", text: "[Placeholder option D]" },
    ],
    correctLabel: "B",
  },
  {
    stem: "[EXAMPLE — DRAFT] Select all teaching points that belong in a placeholder health-promotion checklist. (Not clinical guidance.)",
    clientNeeds: ClientNeeds.HEALTH_PROMOTION_MAINTENANCE,
    scoringModel: ScoringModel.PLUS_MINUS,
    options: [
      { label: "A", text: "[Placeholder selectable A]" },
      { label: "B", text: "[Placeholder selectable B]" },
      { label: "C", text: "[Placeholder selectable C]" },
      { label: "D", text: "[Placeholder selectable D]" },
    ],
    correctLabels: ["A", "C"],
  },
  {
    stem: "[EXAMPLE — AWAITING CLINICAL REVIEW] Psychosocial integrity placeholder stem for UI wiring only.",
    clientNeeds: ClientNeeds.PSYCHOSOCIAL_INTEGRITY,
    scoringModel: ScoringModel.DICHOTOMOUS,
    options: [
      { label: "A", text: "[Placeholder option A]" },
      { label: "B", text: "[Placeholder option B]" },
      { label: "C", text: "[Placeholder option C]" },
      { label: "D", text: "[Placeholder option D]" },
    ],
    correctLabel: "C",
  },
  {
    stem: "[EXAMPLE — DRAFT] Basic care and comfort placeholder item — awaiting clinical authoring.",
    clientNeeds: ClientNeeds.BASIC_CARE_COMFORT,
    scoringModel: ScoringModel.DICHOTOMOUS,
    options: [
      { label: "A", text: "[Placeholder option A]" },
      { label: "B", text: "[Placeholder option B]" },
      { label: "C", text: "[Placeholder option C]" },
      { label: "D", text: "[Placeholder option D]" },
    ],
    correctLabel: "D",
  },
  {
    stem: "[EXAMPLE — AWAITING CLINICAL REVIEW] Pharmacological therapies placeholder — do not use for study until reviewed. Cite DailyMed when authored.",
    clientNeeds: ClientNeeds.PHARMACOLOGICAL_PARENTERAL,
    scoringModel: ScoringModel.DICHOTOMOUS,
    options: [
      { label: "A", text: "[Placeholder option A]" },
      { label: "B", text: "[Placeholder option B]" },
      { label: "C", text: "[Placeholder option C]" },
      { label: "D", text: "[Placeholder option D]" },
    ],
    correctLabel: "A",
  },
  {
    stem: "[EXAMPLE — DRAFT] Reduction of risk potential placeholder stem.",
    clientNeeds: ClientNeeds.REDUCTION_OF_RISK_POTENTIAL,
    scoringModel: ScoringModel.DICHOTOMOUS,
    options: [
      { label: "A", text: "[Placeholder option A]" },
      { label: "B", text: "[Placeholder option B]" },
      { label: "C", text: "[Placeholder option C]" },
      { label: "D", text: "[Placeholder option D]" },
    ],
    correctLabel: "B",
  },
  {
    stem: "[EXAMPLE — AWAITING CLINICAL REVIEW] Physiological adaptation placeholder stem for dashboard/exam UI.",
    clientNeeds: ClientNeeds.PHYSIOLOGICAL_ADAPTATION,
    scoringModel: ScoringModel.DICHOTOMOUS,
    options: [
      { label: "A", text: "[Placeholder option A]" },
      { label: "B", text: "[Placeholder option B]" },
      { label: "C", text: "[Placeholder option C]" },
      { label: "D", text: "[Placeholder option D]" },
    ],
    correctLabel: "C",
  },
];

async function main() {
  console.log("Seeding sources + example questions (NOT clinically verified)…");

  for (const s of SOURCES) {
    await prisma.source.upsert({
      where: { id: `src_${s.organization.toLowerCase().replace(/\W+/g, "_")}` },
      create: {
        id: `src_${s.organization.toLowerCase().replace(/\W+/g, "_")}`,
        ...s,
        lastVerifiedAt: new Date("2026-11-25T00:00:00-05:00"),
      },
      update: { ...s, lastVerifiedAt: new Date("2026-11-25T00:00:00-05:00") },
    });
  }

  const source = await prisma.source.findFirst({
    where: { organization: "NCSBN" },
  });

  let n = 0;
  for (const ex of EXAMPLES) {
    n += 1;
    const status =
      n % 2 === 0
        ? VerificationStatus.DRAFT
        : VerificationStatus.AWAITING_CLINICAL_REVIEW;

    const q = await prisma.question.create({
      data: {
        stem: ex.stem,
        questionType:
          ex.scoringModel === ScoringModel.PLUS_MINUS
            ? QuestionType.MULTIPLE_RESPONSE
            : QuestionType.MULTIPLE_CHOICE,
        scoringModel: ex.scoringModel,
        clientNeeds: ex.clientNeeds,
        verificationStatus: status,
        isExample: true,
        options: {
          create: ex.options.map((o, i) => ({
            label: o.label,
            text: o.text,
            sortOrder: i,
          })),
        },
        rationales: {
          create: {
            body: "[EXAMPLE] Rationale placeholder — replace after clinical review. No clinical claim.",
          },
        },
        ...(source
          ? {
              sources: {
                create: {
                  sourceId: source.id,
                  citationNote: "Structure/reference only — example item.",
                },
              },
            }
          : {}),
      },
      include: { options: true },
    });

    const correctLabels =
      "correctLabels" in ex && ex.correctLabels
        ? ex.correctLabels
        : [ex.correctLabel!];
    const correctIds = q.options
      .filter((o) => correctLabels.includes(o.label))
      .map((o) => o.id);

    await prisma.correctAnswer.create({
      data: {
        questionId: q.id,
        answerKey: {
          method:
            ex.scoringModel === ScoringModel.PLUS_MINUS
              ? "plus_minus"
              : "dichotomous",
          correctOptionIds: correctIds,
          pointsMax:
            ex.scoringModel === ScoringModel.PLUS_MINUS
              ? correctIds.length
              : 1,
        },
        pointsMax:
          ex.scoringModel === ScoringModel.PLUS_MINUS
            ? correctIds.length
            : 1,
      },
    });

    const version = await prisma.questionVersion.create({
      data: {
        questionId: q.id,
        versionNumber: 1,
        stem: q.stem,
        questionType: q.questionType,
        scoringModel: q.scoringModel,
        clientNeeds: q.clientNeeds,
        verificationStatus: q.verificationStatus,
        optionsJson: q.options.map((o) => ({
          id: o.id,
          label: o.label,
          text: o.text,
        })),
        correctJson: {
          method:
            ex.scoringModel === ScoringModel.PLUS_MINUS
              ? "plus_minus"
              : "dichotomous",
          correctOptionIds: correctIds,
          pointsMax:
            ex.scoringModel === ScoringModel.PLUS_MINUS
              ? correctIds.length
              : 1,
        },
        rationaleJson: {
          body: "[EXAMPLE] Rationale placeholder — replace after clinical review.",
        },
      },
    });

    await prisma.question.update({
      where: { id: q.id },
      data: { currentVersionId: version.id },
    });
  }

  await prisma.examVersion.upsert({
    where: { slug: "nclex-fixed-85-demo" },
    create: {
      name: "NCLEX-style fixed practice (85) — demo",
      slug: "nclex-fixed-85-demo",
      description:
        "Blueprint-balanced shell using 2026 Client Needs midpoints. Demo exam version; example items only.",
      questionCount: 85,
      durationMinutes: 180,
      allowBacktrack: false,
      isPublished: false,
    },
    update: {},
  });

  await prisma.examVersion.upsert({
    where: { slug: "hesi-style-150-demo" },
    create: {
      name: "HESI-style fixed mock (150) — demo",
      slug: "hesi-style-150-demo",
      description:
        "Fixed-form ~150 inspired by public Elsevier structure only. Not HESI; original/example items only.",
      questionCount: 150,
      durationMinutes: 240,
      allowBacktrack: true,
      isPublished: false,
    },
    update: {},
  });

  console.log(
    `Done. Seeded ${EXAMPLES.length} EXAMPLE questions (0 clinically approved/published).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
