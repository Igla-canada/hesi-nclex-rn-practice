import type { Jurisdiction, LabUnitSystem } from "@prisma/client";

export const JURISDICTION_LABELS: Record<Jurisdiction, string> = {
  UNIVERSAL: "Universal",
  ONTARIO: "Ontario (CNO)",
  CANADA: "Canada",
  UNITED_STATES: "United States",
};

export const JURISDICTION_DESCRIPTIONS: Record<Jurisdiction, string> = {
  UNIVERSAL: "Correct answer does not depend on province, state, or country.",
  ONTARIO:
    "Depends on Ontario scope of practice or College of Nurses of Ontario standards.",
  CANADA:
    "Depends on Canadian national guidance (for example Diabetes Canada, Heart & Stroke, PHAC).",
  UNITED_STATES:
    "Depends on U.S.-specific guidance or law. Excluded from the default Ontario practice pool.",
};

/** Default practice context for this deployment: an Ontario RN candidate. */
export const DEFAULT_PRACTICE_JURISDICTIONS: Jurisdiction[] = [
  "UNIVERSAL",
  "CANADA",
  "ONTARIO",
];

export const LAB_UNIT_LABELS: Record<LabUnitSystem, string> = {
  NONE: "No lab values",
  SI: "SI units",
  CONVENTIONAL: "Conventional (U.S.) units",
};

/** Canadian items must report lab values in SI units. */
export function requiredLabUnitSystem(
  jurisdiction: Jurisdiction,
): LabUnitSystem | null {
  return jurisdiction === "ONTARIO" || jurisdiction === "CANADA" ? "SI" : null;
}

const CONVENTIONAL_UNIT_PATTERNS: RegExp[] = [
  /\bmg\s*\/\s*dL\b/i,
  /\bg\s*\/\s*dL\b/i,
  /\bmEq\s*\/\s*L\b/i,
  /\bng\s*\/\s*dL\b/i,
];

/**
 * Authoring lint: flags conventional U.S. unit notation in Canadian items.
 * Purely notational — it does not judge clinical values.
 */
export function lintLabUnits(input: {
  jurisdiction: Jurisdiction;
  labUnitSystem: LabUnitSystem;
  text: string;
}): string[] {
  const warnings: string[] = [];
  const required = requiredLabUnitSystem(input.jurisdiction);
  if (required && input.labUnitSystem === "CONVENTIONAL") {
    warnings.push(
      `${JURISDICTION_LABELS[input.jurisdiction]} items must use SI lab units.`,
    );
  }
  if (required) {
    for (const pattern of CONVENTIONAL_UNIT_PATTERNS) {
      const match = input.text.match(pattern);
      if (match) {
        warnings.push(
          `Found "${match[0]}" — Canadian items should express lab values in SI units.`,
        );
      }
    }
  }
  return warnings;
}
