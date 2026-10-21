import { describe, expect, it } from "vitest";
import { minimumBalanceStroops } from "@/app/tools/reserve-calculator/lib/reserve-formula";
import type { SubentryBreakdown } from "@/app/tools/reserve-calculator/types";

const noSubentries: SubentryBreakdown = { trustlines: 0, offers: 0, dataEntries: 0, extraSigners: 0, total: 0 };
const baseReserve = BigInt(5_000_000);

describe("minimumBalanceStroops", () => {
  it("is 2 base reserves for a plain account with no subentries or sponsorship", () => {
    const { minBalanceStroops } = minimumBalanceStroops(noSubentries, 0, 0, baseReserve);
    expect(minBalanceStroops).toBe(BigInt(2) * baseReserve);
  });

  it("adds one base reserve per subentry", () => {
    const subentries: SubentryBreakdown = { trustlines: 2, offers: 1, dataEntries: 0, extraSigners: 0, total: 3 };
    const { minBalanceStroops } = minimumBalanceStroops(subentries, 0, 0, baseReserve);
    expect(minBalanceStroops).toBe(BigInt(5) * baseReserve);
  });

  it("adds a base reserve for each entry this account sponsors for others", () => {
    const { minBalanceStroops, sponsorship } = minimumBalanceStroops(noSubentries, 3, 0, baseReserve);
    expect(minBalanceStroops).toBe(BigInt(5) * baseReserve);
    expect(sponsorship.netReserveStroops).toBe((BigInt(3) * baseReserve).toString());
  });

  it("subtracts a base reserve for each entry sponsored for this account", () => {
    const subentries: SubentryBreakdown = { trustlines: 1, offers: 0, dataEntries: 0, extraSigners: 0, total: 1 };
    const { minBalanceStroops, sponsorship } = minimumBalanceStroops(subentries, 0, 1, baseReserve);
    expect(minBalanceStroops).toBe(BigInt(2) * baseReserve);
    expect(sponsorship.netReserveStroops).toBe((BigInt(-1) * baseReserve).toString());
  });
});
