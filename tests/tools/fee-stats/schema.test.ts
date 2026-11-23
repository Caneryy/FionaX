import { describe, expect, it } from "vitest";
import { validateFeeStatsInput } from "@/app/tools/fee-stats/schema";

describe("validateFeeStatsInput", () => {
  it("accepts testnet and mainnet", () => {
    expect(validateFeeStatsInput("testnet")).toEqual({ ok: true, input: { network: "testnet" } });
    expect(validateFeeStatsInput("MAINNET")).toEqual({ ok: true, input: { network: "mainnet" } });
    expect(validateFeeStatsInput("  testnet  ")).toEqual({ ok: true, input: { network: "testnet" } });
  });

  it("rejects empty and unknown networks", () => {
    expect(validateFeeStatsInput("")).toEqual({ ok: false, error: { code: "invalid_network" } });
    expect(validateFeeStatsInput("  ")).toEqual({ ok: false, error: { code: "invalid_network" } });
    expect(validateFeeStatsInput("futurenet")).toEqual({ ok: false, error: { code: "invalid_network" } });
  });
});
