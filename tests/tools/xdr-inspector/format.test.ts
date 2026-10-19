import { describe, expect, it } from "vitest";
import { formatByteLength, formatDetectedType } from "@/app/tools/xdr-inspector/lib/format";

describe("inspector formatting", () => {
  it("formats type names exactly", () => {
    expect(formatDetectedType("transaction_envelope")).toBe("Transaction envelope");
    expect(formatDetectedType("transaction_result")).toBe("Transaction result");
    expect(formatDetectedType("ledger_entry")).toBe("Ledger entry");
  });
  it("formats byte counts with separators", () => {
    expect(formatByteLength(4)).toBe("4 bytes");
    expect(formatByteLength(262144)).toBe("262,144 bytes");
  });
});
