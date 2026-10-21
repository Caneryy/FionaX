import { describe, expect, it } from "vitest";
import { SignersFailure, parseSigners } from "@/app/tools/account-signers/lib/signer-list";
import { fixtureAccountId, hashSigner, mixedSignersAccount, preauthSigner } from "./fixtures/mixed-signers.fixture";
import { singleSignerAccount } from "./fixtures/single-signer.fixture";

describe("parseSigners", () => {
  it("keeps hash and pre-auth signers that are not public keys", () => {
    const snapshot = parseSigners(mixedSignersAccount, fixtureAccountId);
    expect(snapshot.signers.map((signer) => signer.kind)).toEqual(["ed25519_public_key", "sha256_hash", "preauth_tx"]);
    expect(snapshot.signers.find((signer) => signer.key === hashSigner)?.master).toBe(false);
    expect(snapshot.signers.find((signer) => signer.key === preauthSigner)?.kind).toBe("preauth_tx");
  });

  it("marks the single master signer", () => {
    const snapshot = parseSigners(singleSignerAccount, fixtureAccountId);
    expect(snapshot.signers).toHaveLength(1);
    expect(snapshot.signers[0]?.master).toBe(true);
    expect(snapshot.masterWeightZero).toBe(false);
  });

  it("throws malformed_signer when the type is unknown", () => {
    expect(() =>
      parseSigners(
        {
          account_id: fixtureAccountId,
          thresholds: { low_threshold: 0, med_threshold: 0, high_threshold: 0 },
          signers: [{ key: "abc", weight: 1, type: "nope" }]
        },
        fixtureAccountId
      )
    ).toThrow(SignersFailure);
  });
});
