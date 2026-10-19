import { describe, expect, it } from "vitest";
import { xdr } from "@stellar/stellar-sdk";
import { resultXdr } from "./fixtures/result-xdr.fixture";
import { stringifyXdr, toJsonSafe } from "@/app/tools/xdr-inspector/lib/bigint-json";

describe("XDR JSON conversion", () => {
  it("preserves nested BigInt values and bytes", () => {
    expect(toJsonSafe({ value: [BigInt("9007199254740993"), new Uint8Array([0, 255])] })).toEqual({ value: ["9007199254740993", "00ff"] });
  });
  it("keeps struct fields and union switches visible", () => {
    const value = xdr.TransactionResult.fromXDR(resultXdr, "base64");
    const parsed = JSON.parse(stringifyXdr(value));
    expect(parsed.feeCharged).toBe("9007199254740993");
    expect(parsed.result.switch).toBe("txBadSeq");
    expect(parsed.ext.switch).toBe(0);
  });
});
