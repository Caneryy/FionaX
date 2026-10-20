import { describe, expect, it } from "vitest";
import { extractSponsorshipFields } from "@/app/tools/sponsored-reserves/lib/sponsorship-fields";
import { otherSponsor, viewedAccount } from "./fixtures/sponsor-role.fixture";
import { sponsoreeRoleAccount } from "./fixtures/sponsoree-role.fixture";

describe("account sponsorship fields", () => {
  it("extracts account, trustline and signer sponsors and their reserve weights", () => {
    const fields = extractSponsorshipFields(sponsoreeRoleAccount, viewedAccount);
    expect(fields.entries.map((entry) => [entry.kind, entry.sponsor, entry.reserveUnits])).toEqual([
      ["account", otherSponsor, BigInt("2")], ["trustline", otherSponsor, BigInt("1")], ["signer", otherSponsor, BigInt("1")]
    ]);
  });
  it("counts a sponsored pool share trustline as two reserve units", () => {
    const account = {
      ...sponsoreeRoleAccount,
      num_sponsored: 8,
      balances: [
        ...sponsoreeRoleAccount.balances,
        { asset_type: "liquidity_pool_shares", liquidity_pool_id: "a".repeat(64), balance: "1.0000000", sponsor: otherSponsor }
      ]
    };
    const fields = extractSponsorshipFields(account, viewedAccount);
    expect(fields.entries.at(-2)).toEqual({ kind: "trustline", label: "a".repeat(64), sponsor: otherSponsor, reserveUnits: BigInt("2") });
  });
  it.each([{}, { ...sponsoreeRoleAccount, account_id: otherSponsor }, { ...sponsoreeRoleAccount, num_sponsored: -1 }, { ...sponsoreeRoleAccount, num_sponsored: 0.5 }, { ...sponsoreeRoleAccount, sponsor: "S-invalid" }])("rejects malformed responses", (raw) => {
    expect(() => extractSponsorshipFields(raw, viewedAccount)).toThrow();
  });
  it("rejects malformed sponsored trustlines", () => {
    const malformed = { ...sponsoreeRoleAccount, balances: [{ asset_type: "credit_alphanum4", asset_code: "USD", asset_issuer: "invalid", sponsor: otherSponsor }] };
    expect(() => extractSponsorshipFields(malformed, viewedAccount)).toThrow();
  });
});
