import { describe, expect, it } from "vitest";
import { MAX_XDR_BYTES, validateXdrInspectorInput } from "@/app/tools/xdr-inspector/schema";
import { envelopeXdr } from "./fixtures/envelope-xdr.fixture";
import { malformedBase64 } from "./fixtures/invalid-xdr.fixture";

describe("XDR input validation", () => {
  it("rejects empty and whitespace-only input", () => {
    expect(validateXdrInspectorInput(" ")).toEqual({ ok: false, error: { code: "empty_xdr" } });
    expect(validateXdrInspectorInput(" \n ")).toEqual({ ok: false, error: { code: "empty_xdr" } });
  });
  it("accepts line-wrapped canonical base64", () => {
    const result = validateXdrInspectorInput(`  ${envelopeXdr.slice(0, 20)}\n${envelopeXdr.slice(20)} `);
    expect(result.ok && result.input.base64).toBe(envelopeXdr);
  });
  it("rejects malformed, noncanonical and non-word-aligned input", () => {
    for (const value of [malformedBase64, "Zh==", "YQ==", "AAAAA===", "abc"]) {
      expect(validateXdrInspectorInput(value)).toEqual({ ok: false, error: { code: "invalid_xdr" } });
    }
  });
  it("accepts the maximum size and rejects the next XDR word", () => {
    const exact = Buffer.alloc(MAX_XDR_BYTES).toString("base64");
    expect(validateXdrInspectorInput(exact).ok).toBe(true);
    expect(validateXdrInspectorInput(exact + "AAAAAA==")).toEqual({ ok: false, error: { code: "too_large" } });
  });
  it("rejects a massive whitespace paste before decoding", () => {
    expect(validateXdrInspectorInput(" ".repeat(400000) + "AAAA")).toEqual({ ok: false, error: { code: "too_large" } });
  });
});
