import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import { validateReserveCalculatorInput } from "@/app/tools/reserve-calculator/schema";
import { simpleAccountId } from "@/tests/tools/reserve-calculator/fixtures/simple-account.fixture";

describe("validateReserveCalculatorInput", () => {
  it("rejects empty input", () => {
    const result = validateReserveCalculatorInput("  ");
    expect(result.ok).toBe(false);
  });

  it("accepts a valid account ID", () => {
    expect(validateReserveCalculatorInput(simpleAccountId).ok).toBe(true);
  });

  it("rejects a malformed account ID", () => {
    expect(validateReserveCalculatorInput("GABC").ok).toBe(false);
  });

  it("rejects a secret key before any request", () => {
    const seed = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 9)).secret();
    const result = validateReserveCalculatorInput(seed);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain(seed);
  });
});
