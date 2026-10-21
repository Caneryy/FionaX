import { describe, expect, it } from "vitest";
import { describeEffect, knownEffectTypes } from "@/app/tools/effects-timeline/lib/effect-descriptions";
import type { TimelineEffect } from "@/app/tools/effects-timeline/types";

const effect = (type: string, details: Record<string, unknown> = {}): TimelineEffect =>
  ({ pagingToken: "1-1", type, createdAt: null, details });

describe("effect descriptions", () => {
  it("covers all documented Horizon classic effect types with distinct descriptions", () => {
    const types = knownEffectTypes();
    expect(types).toHaveLength(48);
    const descriptions = types.map((type) => describeEffect(effect(type)));
    expect(new Set(descriptions).size).toBe(types.length);
    expect(descriptions.every((description) => description.length > 15)).toBe(true);
  });

  it("preserves exact decimal amount strings without floating point conversion", () => {
    expect(describeEffect(effect("account_credited", { amount: "0.0000001", asset_type: "native" })))
      .toBe("Account received 0.0000001 XLM.");
    expect(describeEffect(effect("account_debited", { amount: "9007199254740993.0000001", asset_code: "USD" })))
      .toBe("Account sent 9007199254740993.0000001 USD.");
  });

  it("uses optional effect details when present", () => {
    expect(describeEffect(effect("account_created", { starting_balance: "2.5000000" })))
      .toBe("Account created with 2.5000000 XLM.");
    expect(describeEffect(effect("data_created", { name: "config" })))
      .toBe("Account data entry “config” created.");
  });
});
