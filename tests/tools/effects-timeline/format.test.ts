import { describe, expect, it } from "vitest";
import { formatEffectTime, shortAccountId } from "@/app/tools/effects-timeline/lib/format";
import { copy } from "@/app/tools/effects-timeline/copy";
import { accountId } from "./fixtures/known-effects.fixture";

describe("presentation formatting", () => {
  it("formats timestamps in UTC", () => {
    expect(formatEffectTime("2026-10-20T15:00:00+03:00")).toBe("Oct 20, 2026, 12:00 PM UTC");
  });
  it("uses a fallback for absent or malformed timestamps", () => {
    expect(formatEffectTime(null)).toBe(copy.timeUnavailable);
    expect(formatEffectTime("bad date")).toBe(copy.timeUnavailable);
  });
  it("shortens public account IDs consistently", () => {
    expect(shortAccountId(accountId)).toBe("GCNL55…23WOTE");
  });
});
