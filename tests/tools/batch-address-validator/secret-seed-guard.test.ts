import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { batchContainsSecretSeed, isSecretSeedShape } from "@/app/tools/batch-address-validator/lib/secret-seed-guard";
import { publicKeyFromFixedSeed } from "@/tests/tools/batch-address-validator/fixtures/mixed-batch.fixture";
import { FAKE_SECRET_SHAPED } from "@/tests/tools/batch-address-validator/fixtures/secret-seed-batch.fixture";

describe("secret seed guard", () => {
  it("flags a fake seed-shaped string and ignores public keys", () => {
    expect(isSecretSeedShape(FAKE_SECRET_SHAPED)).toBe(true);
    expect(isSecretSeedShape(publicKeyFromFixedSeed(1))).toBe(false);
    expect(isSecretSeedShape("not-a-stellar-address")).toBe(false);
  });

  it("flags a short S-prefixed fragment so it cannot be echoed later", () => {
    expect(isSecretSeedShape("spartial")).toBe(true);
  });

  it("flags a checksum-valid secret created in memory", () => {
    const secret = Keypair.fromRawEd25519Seed(new Uint8Array(32).fill(9)).secret();

    expect(isSecretSeedShape(secret)).toBe(true);
    expect(batchContainsSecretSeed([{ value: publicKeyFromFixedSeed(1) }, { value: secret }])).toBe(true);
  });

  it("flags a seed embedded in a larger entry", () => {
    expect(isSecretSeedShape(`note ${FAKE_SECRET_SHAPED} trailing`)).toBe(true);
  });
});
