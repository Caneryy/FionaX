import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/memo-inspector/copy";
import {
  formatBase64,
  formatHex,
  formatMemoId,
  formatMemoKind,
  formatNetworkName,
  formatTransactionStatus
} from "@/app/tools/memo-inspector/lib/format";

describe("memo inspector formatting", () => {
  it("formats memo kinds from copy", () => {
    expect(formatMemoKind("hash")).toBe(copy.kinds.hash);
    expect(formatMemoKind("return")).toBe(copy.kinds.return);
    expect(formatMemoKind("none")).toBe(copy.kinds.none);
  });

  it("formats network, status, id, and encodings exactly", () => {
    expect(formatNetworkName("testnet")).toBe("Testnet");
    expect(formatTransactionStatus(true)).toBe(copy.status.successful);
    expect(formatTransactionStatus(false)).toBe(copy.status.failed);
    expect(formatMemoId("42")).toBe("42");
    expect(formatHex("AABB")).toBe("aabb");
    expect(formatBase64("AAA=")).toBe("AAA=");
  });
});
