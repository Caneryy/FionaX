import { describe, expect, it } from "vitest";
import { runReserveCalculator } from "@/app/tools/reserve-calculator/lib/reserveCalculator";
import { simpleAccountDeps, simpleAccountId } from "@/tests/tools/reserve-calculator/fixtures/simple-account.fixture";
import { sponsoredAccountDeps, sponsoredAccountId } from "@/tests/tools/reserve-calculator/fixtures/sponsored-account.fixture";
import { liabilitiesAccountDeps, liabilitiesAccountId } from "@/tests/tools/reserve-calculator/fixtures/liabilities-account.fixture";

describe("runReserveCalculator", () => {
  it("computes the minimum and available balance for a plain account", async () => {
    const result = await runReserveCalculator({ accountId: simpleAccountId }, simpleAccountDeps);
    expect(result.minBalanceStroops).toBe((BigInt(2) * BigInt(5_000_000)).toString());
    expect(result.balanceStroops).toBe("1000000000");
    expect(result.availableBalanceStroops).toBe((BigInt(1_000_000_000) - BigInt(10_000_000)).toString());
  });

  it("applies the sponsorship adjustment for a sponsoring/sponsored account", async () => {
    const result = await runReserveCalculator({ accountId: sponsoredAccountId }, sponsoredAccountDeps);
    expect(result.sponsorship).toEqual({
      numSponsoring: 3,
      numSponsored: 1,
      netReserveStroops: (BigInt(2) * BigInt(5_000_000)).toString()
    });
  });

  it("shows spendable balance separately from available balance when selling liabilities are present", async () => {
    const result = await runReserveCalculator({ accountId: liabilitiesAccountId }, liabilitiesAccountDeps);
    expect(result.sellingLiabilitiesStroops).toBe("200000000");
    expect(BigInt(result.spendableBalanceStroops)).toBeLessThan(BigInt(result.availableBalanceStroops));
  });
});
