import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/account-signers/copy";
import { formatSignerKind, formatThreshold, formatWeight } from "@/app/tools/account-signers/lib/format";

describe("signer formatting", () => {
  it("formats weight and thresholds as decimal strings", () => {
    expect(formatWeight(0)).toBe("0");
    expect(formatThreshold({ low: 1, medium: 2, high: 3 }, "medium")).toBe("2");
  });

  it("uses the type labels from copy", () => {
    expect(formatSignerKind("sha256_hash")).toBe(copy.kinds.sha256_hash);
    expect(formatSignerKind("preauth_tx")).toBe(copy.kinds.preauth_tx);
  });
});
