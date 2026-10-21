import { describe, expect, it } from "vitest";
import { formatSequenceNumber } from "@/app/tools/preconditions-explainer/lib/format";

describe("formatSequenceNumber", () => {
  it("returns the value unchanged", () => {
    expect(formatSequenceNumber("41")).toBe("41");
  });
});
