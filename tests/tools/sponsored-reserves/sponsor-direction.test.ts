import { describe, expect, it } from "vitest";
import { splitSponsorDirections } from "@/app/tools/sponsored-reserves/lib/sponsor-direction";
import { extractSponsorshipFields } from "@/app/tools/sponsored-reserves/lib/sponsorship-fields";
import { sponsorRoleAccount, viewedAccount } from "./fixtures/sponsor-role.fixture";
import { sponsoreeRoleAccount } from "./fixtures/sponsoree-role.fixture";
import { noSponsorshipAccount } from "./fixtures/no-sponsorship.fixture";
import { otherSponsor } from "./fixtures/sponsor-role.fixture";
import { SponsoredReservesResult } from "@/app/tools/sponsored-reserves/components/SponsoredReservesResult";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

describe("sponsorship directions", () => {
  it("keeps both roles independent and accounts for unlisted units", () => {
    const result = splitSponsorDirections(extractSponsorshipFields(sponsoreeRoleAccount, viewedAccount), "testnet");
    expect(result.sponsoredByMeCount).toBe(BigInt("3"));
    expect(result.sponsoredForMeCount).toBe(BigInt("6"));
    expect(result.unlistedReserveCount).toBe(BigInt("2"));
    expect(result.reliefStroops).toBe(BigInt("30000000"));
  });
  it("rejects contradictory counts", () => {
    const fields = extractSponsorshipFields(sponsoreeRoleAccount, viewedAccount);
    expect(() => splitSponsorDirections({ ...fields, numSponsored: BigInt("3") }, "testnet")).toThrow();
  });
  it("does not treat a sponsor-only account as an empty state", () => {
    const result = splitSponsorDirections(extractSponsorshipFields(sponsorRoleAccount, viewedAccount), "testnet");
    const html = renderToStaticMarkup(createElement(SponsoredReservesResult, { result }));
    expect(result.sponsoredByMeCount).toBe(BigInt("3"));
    expect(result.sponsoredForMeCount).toBe(BigInt("0"));
    expect(html).toContain("I sponsor for others");
    expect(html).toContain("0 XLM");
    expect(html).not.toContain("No sponsorship relationships");
  });
  it("renders separate directions, the known sponsor and the unlisted count", () => {
    const result = splitSponsorDirections(extractSponsorshipFields(sponsoreeRoleAccount, viewedAccount), "testnet");
    const html = renderToStaticMarkup(createElement(SponsoredReservesResult, { result }));
    expect(html).toContain("I sponsor for others");
    expect(html).toContain("Sponsored for me");
    expect(html).toContain(otherSponsor);
    expect(html).toContain("2 reserve units");
    expect(html).toContain("3 XLM");
  });
  it("renders an explicit empty state for a zero/zero account", () => {
    const result = splitSponsorDirections(extractSponsorshipFields(noSponsorshipAccount, viewedAccount), "mainnet");
    const html = renderToStaticMarkup(createElement(SponsoredReservesResult, { result }));
    expect(html).toContain("No sponsorship relationships");
  });
});
