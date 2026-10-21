import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { explainIssuerFlags } from "@/app/tools/asset-flags-inspector/lib/flag-explanations";
import { ISSUER_FLAG_KEYS } from "@/app/tools/asset-flags-inspector/types";
import { allFlagsSetFlags } from "./fixtures/all-flags-set.fixture";
import { immutableIssuerFlags } from "./fixtures/immutable-issuer.fixture";
import { noFlagsSetFlags } from "./fixtures/no-flags-set.fixture";

describe("explainIssuerFlags", () => {
  it("lists every flag even when all of them are unset", () => {
    const explanation = explainIssuerFlags(noFlagsSetFlags);

    expect(explanation.rows.map((row) => row.key)).toEqual([...ISSUER_FLAG_KEYS]);
    expect(explanation.rows.every((row) => row.enabled === false)).toBe(true);
    expect(explanation.allUnset).toBe(true);
    expect(explanation.combination).toContain(copy.flags.auth_required.disabled);
    expect(explanation.combination).toContain(copy.flags.auth_revocable.disabled);
    expect(explanation.combination).toContain(copy.flags.auth_clawback_enabled.disabled);
    expect(explanation.immutableNotice).toBeNull();
    expect(explanation.adjustableNotice).toBe(copy.adjustable.body);
    expect(explanation.combination.includes(copy.errors.account_not_found)).toBe(false);
    expect(copy.explanation.allUnset).not.toBe(copy.errors.account_not_found);
  });

  it("explains a holder path when every flag is on", () => {
    const explanation = explainIssuerFlags(allFlagsSetFlags);

    expect(explanation.allUnset).toBe(false);
    expect(explanation.rows.every((row) => row.enabled)).toBe(true);
    expect(explanation.combination).toContain(copy.flags.auth_required.enabled);
    expect(explanation.combination).toContain(copy.flags.auth_revocable.enabled);
    expect(explanation.combination).toContain(copy.flags.auth_clawback_enabled.enabled);
    expect(explanation.immutableNotice).toBe(copy.immutable.body);
    expect(explanation.adjustableNotice).toBeNull();
    expect(explanation.immutableNotice).toMatch(/never/i);
  });

  it("calls out an immutable issuer separately from the adjustable flags", () => {
    const explanation = explainIssuerFlags(immutableIssuerFlags);
    const immutableRow = explanation.rows.find((row) => row.key === "auth_immutable");

    expect(immutableRow?.enabled).toBe(true);
    expect(immutableRow?.detail).toBe(copy.flags.auth_immutable.enabled);
    expect(explanation.immutableNotice).toBe(copy.immutable.body);
    expect(explanation.immutableNotice).not.toBe(immutableRow?.detail);
    expect(explanation.immutableNotice).toMatch(/auth_required, auth_revocable, and auth_clawback_enabled/);
    expect(explanation.adjustableNotice).toBeNull();
    expect(explanation.combination).toContain(copy.flags.auth_required.enabled);
    expect(explanation.combination).toContain(copy.flags.auth_revocable.disabled);
    expect(explanation.combination).toContain(copy.flags.auth_clawback_enabled.disabled);
  });
});
