import { describe, expect, it } from "vitest";
import bank from "../../data/question-bank/question-bank.json";
import { safeVerificationStatus } from "./question-bank-import";

describe("question bank import status", () => {
  it("keeps every compiled item source-verified and unapproved", () => {
    const items = bank.items;
    expect(items).toHaveLength(750);
    const statuses = new Set(
      items.map((item) => safeVerificationStatus(item.verification_status)),
    );
    expect(statuses).toEqual(new Set(["SOURCE_VERIFIED"]));
    expect(safeVerificationStatus("Approved")).toBe("SOURCE_VERIFIED");
    expect(safeVerificationStatus("Clinically reviewed")).toBe("SOURCE_VERIFIED");
    expect(safeVerificationStatus("Awaiting clinical review")).toBe(
      "AWAITING_CLINICAL_REVIEW",
    );
  });
});
