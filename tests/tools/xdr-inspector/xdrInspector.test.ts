import { describe, expect, it } from "vitest";
import { runXdrInspector } from "@/app/tools/xdr-inspector/lib/xdrInspector";
import { copy } from "@/app/tools/xdr-inspector/copy";
import { envelopeXdr } from "./fixtures/envelope-xdr.fixture";
import { resultXdr } from "./fixtures/result-xdr.fixture";
import { ledgerXdr } from "./fixtures/ledger-xdr.fixture";
import { malformedBase64, unsupportedXdr } from "./fixtures/invalid-xdr.fixture";

describe("XDR inspector", () => {
  it.each([
    [envelopeXdr, "transaction_envelope"],
    [resultXdr, "transaction_result"],
    [ledgerXdr, "ledger_entry"]
  ])("returns decoded JSON for a supported type", (blob, type) => {
    const outcome = runXdrInspector(blob);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.type).toBe(type);
      expect(JSON.parse(outcome.result.json)).toBeTruthy();
    }
  });
  it.each([
    ["", "empty_xdr"],
    [malformedBase64, "invalid_xdr"],
    [unsupportedXdr, "undetected_type"]
  ] as const)("returns actionable %s error", (blob, code) => {
    expect(runXdrInspector(blob)).toEqual({ ok: false, error: { code } });
    expect(copy.errors[code].length).toBeGreaterThan(15);
  });
  it("returns too_large for an oversized blob", () => {
    expect(runXdrInspector("AAAA".repeat(90000))).toEqual({ ok: false, error: { code: "too_large" } });
    expect(copy.errors.too_large.length).toBeGreaterThan(15);
  });
});
