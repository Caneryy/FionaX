import { describe, expect, it } from "vitest";
import { DETECTION_ORDER, detectXdr } from "@/app/tools/xdr-inspector/lib/xdr-detect";
import { envelopeXdr } from "./fixtures/envelope-xdr.fixture";
import { resultXdr } from "./fixtures/result-xdr.fixture";
import { ledgerXdr } from "./fixtures/ledger-xdr.fixture";
import { unsupportedXdr } from "./fixtures/invalid-xdr.fixture";

describe("XDR detection", () => {
  it("tries types in a fixed order", () => {
    expect(DETECTION_ORDER).toEqual(["transaction_envelope", "transaction_result", "ledger_entry"]);
  });
  it.each([
    [envelopeXdr, "transaction_envelope"],
    [resultXdr, "transaction_result"],
    [ledgerXdr, "ledger_entry"]
  ])("detects the matching complete blob", (blob, type) => {
    expect(detectXdr(blob)?.type).toBe(type);
  });
  it("rejects trailing bytes and unsupported XDR", () => {
    expect(detectXdr(Buffer.concat([Buffer.from(resultXdr, "base64"), Buffer.alloc(4)]).toString("base64"))).toBeNull();
    expect(detectXdr(unsupportedXdr)).toBeNull();
  });
});
