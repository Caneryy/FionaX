import { describe, expect, it } from "vitest";
import {
  AUTH_CLAWBACK_ENABLED_BIT,
  AUTH_IMMUTABLE_BIT,
  AUTH_REQUIRED_BIT,
  AUTH_REVOCABLE_BIT,
  computeFlagBitmask,
  flagBit
} from "@/app/tools/asset-flags-inspector/lib/flag-bitmask";
import type { IssuerFlags } from "@/app/tools/asset-flags-inspector/types";
import { allFlagsSetFlags } from "./fixtures/all-flags-set.fixture";
import { immutableIssuerFlags } from "./fixtures/immutable-issuer.fixture";
import { noFlagsSetFlags } from "./fixtures/no-flags-set.fixture";

const none: IssuerFlags = {
  auth_required: false,
  auth_revocable: false,
  auth_immutable: false,
  auth_clawback_enabled: false
};

describe("computeFlagBitmask", () => {
  it("uses the protocol bit for each flag", () => {
    expect(AUTH_REQUIRED_BIT).toBe(1n);
    expect(AUTH_REVOCABLE_BIT).toBe(2n);
    expect(AUTH_IMMUTABLE_BIT).toBe(4n);
    expect(AUTH_CLAWBACK_ENABLED_BIT).toBe(8n);
    expect(flagBit("auth_required")).toBe(1n);
    expect(flagBit("auth_revocable")).toBe(2n);
    expect(flagBit("auth_immutable")).toBe(4n);
    expect(flagBit("auth_clawback_enabled")).toBe(8n);
  });

  it("returns 0 when every flag is unset", () => {
    expect(computeFlagBitmask(none)).toBe(0n);
    expect(computeFlagBitmask(noFlagsSetFlags)).toBe(0n);
  });

  it("sets only the bits for enabled flags", () => {
    expect(computeFlagBitmask({ ...none, auth_required: true })).toBe(1n);
    expect(computeFlagBitmask({ ...none, auth_revocable: true })).toBe(2n);
    expect(computeFlagBitmask({ ...none, auth_immutable: true })).toBe(4n);
    expect(computeFlagBitmask({ ...none, auth_clawback_enabled: true })).toBe(8n);
  });

  it("combines the fixture masks", () => {
    expect(computeFlagBitmask(allFlagsSetFlags)).toBe(15n);
    expect(computeFlagBitmask(immutableIssuerFlags)).toBe(5n);
  });

  it("returns a bigint rather than a number", () => {
    expect(typeof computeFlagBitmask(allFlagsSetFlags)).toBe("bigint");
  });
});
