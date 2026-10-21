import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/asset-metadata/copy";
import { buildMetadataFields } from "@/app/tools/asset-metadata/lib/currency-fields";
import { formatAmount, formatTomlValue } from "@/app/tools/asset-metadata/lib/format";
import { parseCurrencyEntries } from "@/app/tools/asset-metadata/lib/stellar-toml";
import { CURRENCY_FIELD_KEYS } from "@/app/tools/asset-metadata/types";
import {
  FIXED_NUMBER,
  FULL_TOML,
  MAX_NUMBER
} from "@/tests/tools/asset-metadata/fixtures/full-currency.fixture";
import {
  PARTIAL_ABSENT_KEYS,
  PARTIAL_PRESENT_KEYS,
  PARTIAL_TOML
} from "@/tests/tools/asset-metadata/fixtures/partial-currency.fixture";

describe("formatAmount", () => {
  it("groups integer strings with BigInt", () => {
    expect(formatAmount("100000")).toBe("100,000");
    expect(formatAmount("0")).toBe("0");
    expect(formatAmount("-2")).toBe("-2");
    expect(formatAmount(FIXED_NUMBER)).toBe("123,456,789,012,345,678,901,234,567,890");
    expect(formatAmount(MAX_NUMBER)).toBe("2,500,000");
  });

  it("rejects values that are not integer strings", () => {
    expect(() => formatAmount("1.5")).toThrow(/integer string/);
    expect(() => formatAmount("10e2")).toThrow(/integer string/);
  });
});

describe("formatTomlValue", () => {
  it("formats booleans, lists, and redacts secret seeds", () => {
    const seed = Keypair.random().secret();
    expect(formatTomlValue(true, "boolean")).toBe(copy.booleanYes);
    expect(formatTomlValue(false, "boolean")).toBe(copy.booleanNo);
    expect(formatTomlValue(["0xabc", "0xdef"], "list")).toBe("0xabc\n0xdef");
    expect(formatTomlValue(seed, "text")).toBe(copy.redactedSecret);
    expect(formatTomlValue(seed, "text")).not.toContain(seed);
  });
});

describe("buildMetadataFields", () => {
  it("formats every present field in the full entry and keeps an extra key", () => {
    const entries = parseCurrencyEntries(FULL_TOML);
    const fields = buildMetadataFields(entries[1]);
    const byKey = Object.fromEntries(fields.map((field) => [field.key, field]));

    expect(byKey.desc.display).toBe("A published description\nof the asset.\n");
    expect(byKey.fixed_number.display).toBe("123,456,789,012,345,678,901,234,567,890");
    expect(byKey.max_number.display).toBe("2,500,000");
    expect(byKey.display_decimals.display).toBe("2");
    expect(byKey.is_unlimited.display).toBe(copy.booleanNo);
    expect(byKey.is_asset_anchored.display).toBe(copy.booleanYes);
    expect(byKey.regulated.display).toBe(copy.booleanYes);
    expect(byKey.collateral_addresses.display).toBe("0xabc\n0xdef");
    expect(byKey.image.href).toBe("https://cdn.example.com/usdc.png");
    expect(byKey.image.imageUrl).toBe("https://cdn.example.com/usdc.png");
    expect(byKey.extra_note.present).toBe(true);
    expect(byKey.extra_note.display).toBe("Shown because the file published it.");
    expect(fields.filter((field) => !field.present)).toHaveLength(1);
    expect(byKey.code_template.present).toBe(false);
    expect(byKey.code_template.display).toBeNull();
  });

  it("marks description, image, and conditions absent on a partial entry", () => {
    const [entry] = parseCurrencyEntries(PARTIAL_TOML);
    const fields = buildMetadataFields(entry);
    for (const key of PARTIAL_PRESENT_KEYS) {
      expect(fields.find((field) => field.key === key)?.present).toBe(true);
    }
    for (const key of PARTIAL_ABSENT_KEYS) {
      const field = fields.find((item) => item.key === key);
      expect(field?.present).toBe(false);
      expect(field?.display).toBeNull();
      expect(copy.missingField(field?.label ?? "")).toContain("is not published");
    }
    expect(fields.filter((field) => CURRENCY_FIELD_KEYS.includes(field.key as (typeof CURRENCY_FIELD_KEYS)[number])).length).toBe(
      CURRENCY_FIELD_KEYS.length
    );
  });
});
