import { describe, expect, it } from "vitest";
import { readThresholds } from "@/app/tools/account-signers/lib/threshold-fields";

describe("readThresholds", () => {
  it("reads the three Horizon threshold fields", () => {
    expect(readThresholds({ low_threshold: 0, med_threshold: 1, high_threshold: 255 })).toEqual({
      low: 0,
      medium: 1,
      high: 255
    });
  });

  it("rejects a threshold outside 0 to 255", () => {
    expect(readThresholds({ low_threshold: -1, med_threshold: 0, high_threshold: 0 })).toBeNull();
    expect(readThresholds({ low_threshold: 1.5, med_threshold: 0, high_threshold: 0 })).toBeNull();
  });
});
