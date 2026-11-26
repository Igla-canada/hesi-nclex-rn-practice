/** Maps author labels onto Prisma. Never returns a clinical-approval status. */
const STATUS: Record<string, string> = {
  Draft: "DRAFT",
  "Source verified": "SOURCE_VERIFIED",
  "Awaiting clinical review": "AWAITING_CLINICAL_REVIEW",
  "Requires revision": "REQUIRES_REVISION",
  Archived: "ARCHIVED",
  "Clinically reviewed": "SOURCE_VERIFIED",
  Approved: "SOURCE_VERIFIED",
};

const BLOCKED = new Set(["APPROVED", "CLINICALLY_REVIEWED"]);

export function safeVerificationStatus(label: string | undefined): string {
  const mapped = (label && STATUS[label]) || "DRAFT";
  if (BLOCKED.has(mapped)) return "SOURCE_VERIFIED";
  return mapped;
}
