import { describe, expect, it } from "vitest";
import { describeEffect } from "@/app/tools/effects-timeline/lib/effect-descriptions";
import { isUnknownEffect, unknownEffectLabel } from "@/app/tools/effects-timeline/lib/unknown-effect";
import type { TimelineEffect } from "@/app/tools/effects-timeline/types";
import { unknownEffect } from "./fixtures/unknown-effect.fixture";

describe("unknown effects", () => {
  it("shows the raw type for an unrecognized future effect", () => {
    const effect: TimelineEffect = {
      pagingToken: unknownEffect.paging_token,
      type: unknownEffect.type,
      createdAt: unknownEffect.created_at,
      details: {}
    };
    expect(isUnknownEffect(effect)).toBe(true);
    expect(unknownEffectLabel(effect)).toBe("future_effect");
    expect(describeEffect(effect)).toBe("future_effect");
  });

  it("recognizes a known type without depending on the prototype chain", () => {
    const effect: TimelineEffect = { pagingToken: "1-1", type: "account_created", createdAt: null, details: {} };
    expect(isUnknownEffect(effect)).toBe(false);
  });
});
