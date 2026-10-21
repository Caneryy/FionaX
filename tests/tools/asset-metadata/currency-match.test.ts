import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/asset-metadata/copy";
import { matchCurrency } from "@/app/tools/asset-metadata/lib/currency-match";
import { parseCurrencyEntries, type CurrencyEntry } from "@/app/tools/asset-metadata/lib/stellar-toml";
import {
  ASSET_CODE,
  FULL_TOML,
  ISSUER_ACCOUNT_ID,
  OTHER_ISSUER_ACCOUNT_ID
} from "@/tests/tools/asset-metadata/fixtures/full-currency.fixture";

function entry(values: CurrencyEntry["values"]): CurrencyEntry {
  return { values };
}

describe("matchCurrency", () => {
  it("selects the code whose issuer matches and skips a different code", () => {
    const entries = parseCurrencyEntries(FULL_TOML);
    const result = matchCurrency(entries, ASSET_CODE, ISSUER_ACCOUNT_ID);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.entry.values.code).toBe(ASSET_CODE);
  });

  it("returns currency_not_found when the code or issuer does not match", () => {
    const entries = parseCurrencyEntries(FULL_TOML);
    const wrongCode = matchCurrency(entries, "MISSING", ISSUER_ACCOUNT_ID);
    const wrongIssuer = matchCurrency(entries, ASSET_CODE, OTHER_ISSUER_ACCOUNT_ID);
    const wrongCase = matchCurrency(entries, "usdc", ISSUER_ACCOUNT_ID);
    expect(wrongCode).toEqual({ ok: false, error: { code: "currency_not_found", message: copy.errors.currency_not_found } });
    expect(wrongIssuer.ok).toBe(false);
    expect(wrongCase.ok).toBe(false);
    if (!wrongIssuer.ok) expect(wrongIssuer.error.code).toBe("currency_not_found");
  });

  it("matches an entry that omits issuer and prefers an explicit issuer when both exist", () => {
    const open = entry({ code: ASSET_CODE, name: "Open" });
    const named = entry({ code: ASSET_CODE, issuer: ISSUER_ACCOUNT_ID, name: "Named" });
    const other = entry({ code: ASSET_CODE, issuer: OTHER_ISSUER_ACCOUNT_ID, name: "Other" });
    const onlyOpen = matchCurrency([open], ASSET_CODE, ISSUER_ACCOUNT_ID);
    const preferred = matchCurrency([open, other, named], ASSET_CODE, ISSUER_ACCOUNT_ID);
    const template = matchCurrency([entry({ code_template: "TEMPLATE", name: "Template" })], "TEMPLATE", ISSUER_ACCOUNT_ID);

    expect(onlyOpen.ok).toBe(true);
    if (onlyOpen.ok) expect(onlyOpen.entry.values.name).toBe("Open");
    expect(preferred.ok).toBe(true);
    if (preferred.ok) expect(preferred.entry.values.name).toBe("Named");
    expect(template.ok).toBe(true);
    if (template.ok) expect(template.entry.values.name).toBe("Template");
  });

  it("returns currency_not_found for an empty list", () => {
    const result = matchCurrency([], ASSET_CODE, ISSUER_ACCOUNT_ID);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("currency_not_found");
  });
});
