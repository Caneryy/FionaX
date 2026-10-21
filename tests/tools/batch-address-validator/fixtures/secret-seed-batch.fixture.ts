import { publicKeyFromFixedSeed } from "@/tests/tools/batch-address-validator/fixtures/mixed-batch.fixture";

/**
 * Clearly fake secret-seed shape. The checksum is invalid, so the SDK does not
 * treat it as a real seed, and it is not a funded account.
 */
export const FAKE_SECRET_SHAPED = `S${"A".repeat(55)}`;

export const secretSeedBatchRaw = [publicKeyFromFixedSeed(1), FAKE_SECRET_SHAPED, publicKeyFromFixedSeed(2)].join(
  "\n"
);
