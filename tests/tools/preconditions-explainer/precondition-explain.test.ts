import { describe, expect, it } from "vitest";
import {
  explainLedgerBounds,
  explainMinSequenceAge,
  explainMinSequenceLedgerGap,
  explainMinSequenceNumber,
  explainTimeBounds
} from "@/app/tools/preconditions-explainer/lib/precondition-explain";

describe("precondition-explain", () => {
  it("explains unbounded time bounds in plain language", () => {
    expect(explainTimeBounds({ minTime: "0", maxTime: "0" })).toContain("No time restriction");
  });

  it("explains concrete time bounds", () => {
    expect(explainTimeBounds({ minTime: "1700000000", maxTime: "1700086400" })).toContain("Valid from");
  });

  it("explains ledger bounds", () => {
    expect(explainLedgerBounds({ minLedger: 100, maxLedger: 200 })).toBe("Valid from ledger 100 until ledger 200.");
  });

  it("explains an unbounded ledger range", () => {
    expect(explainLedgerBounds({ minLedger: 0, maxLedger: 0 })).toBe("Valid from any ledger until no upper bound.");
  });

  it("explains the three sequence-number conditions", () => {
    expect(explainMinSequenceNumber("41")).toContain("41");
    expect(explainMinSequenceAge("3600")).toContain("3600 second(s)");
    expect(explainMinSequenceLedgerGap(10)).toContain("10 ledger(s)");
  });
});
