import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/batch-address-validator/copy";
import {
  formatCount,
  formatRowIssue,
  formatRowLocation,
  formatStatusLabel,
  formatSummaryLine
} from "@/app/tools/batch-address-validator/lib/format";

describe("format", () => {
  it("formats a row location from the original line and input order", () => {
    expect(formatRowLocation({ line: 2, index: 2 })).toBe("Line 2, entry 3");
  });

  it("formats status labels from copy", () => {
    expect(formatStatusLabel("valid")).toBe("Valid");
    expect(formatStatusLabel("invalid")).toBe(copy.status.invalid);
    expect(formatStatusLabel("duplicate")).toBe(copy.status.duplicate);
  });

  it("formats the summary line exactly", () => {
    expect(formatSummaryLine({ total: 4, valid: 2, invalid: 1, duplicate: 1 })).toBe(
      "2 valid, 1 invalid, 1 duplicate"
    );
    expect(formatCount(2, "valid")).toBe("2 valid");
    expect(formatCount(1, "invalid")).toBe("1 invalid");
    expect(formatCount(1, "duplicate")).toBe("1 duplicate");
    expect(formatCount(4, "total")).toBe("4 total");
  });

  it("maps row issues to the shared error copy", () => {
    expect(formatRowIssue("invalid_address")).toBe(copy.errors.invalid_address);
    expect(formatRowIssue("duplicate_address")).toBe(copy.errors.duplicate_address);
    expect(formatRowIssue(null)).toBe("");
  });
});
