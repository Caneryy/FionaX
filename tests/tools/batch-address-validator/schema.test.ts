import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/batch-address-validator/copy";
import { MAX_BATCH_ENTRIES } from "@/app/tools/batch-address-validator/lib/limits";
import { validateBatchAddressValidatorInput } from "@/app/tools/batch-address-validator/schema";
import { publicKeyFromFixedSeed } from "@/tests/tools/batch-address-validator/fixtures/mixed-batch.fixture";
import {
  FAKE_SECRET_SHAPED,
  secretSeedBatchRaw
} from "@/tests/tools/batch-address-validator/fixtures/secret-seed-batch.fixture";

describe("validateBatchAddressValidatorInput", () => {
  it("rejects an empty or whitespace-only batch", () => {
    for (const raw of ["", "   ", "\n\n", " , , "]) {
      const parsed = validateBatchAddressValidatorInput(raw);
      expect(parsed.ok).toBe(false);
      if (parsed.ok) continue;
      expect(parsed.error.code).toBe("empty_batch");
      expect(parsed.error.message).toBe(copy.errors.empty_batch);
    }
  });

  it("rejects a batch over the entry limit", () => {
    const raw = Array.from({ length: MAX_BATCH_ENTRIES + 1 }, (_, index) => `bad-${index}`).join("\n");
    const parsed = validateBatchAddressValidatorInput(raw);

    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error.code).toBe("too_many_entries");
    expect(parsed.error.message).toBe(copy.errors.too_many_entries);
    expect(parsed.error.message).toContain(String(MAX_BATCH_ENTRIES));
  });

  it("accepts a batch at the entry limit", () => {
    const raw = Array.from({ length: MAX_BATCH_ENTRIES }, (_, index) => `bad-${index}`).join("\n");
    const parsed = validateBatchAddressValidatorInput(raw);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.input.entries).toHaveLength(MAX_BATCH_ENTRIES);
  });

  it("rejects a secret-shaped entry inside a larger batch without echoing it", () => {
    const parsed = validateBatchAddressValidatorInput(secretSeedBatchRaw);

    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error.code).toBe("contains_secret_seed");
    expect(parsed.error.message).toBe(copy.errors.contains_secret_seed);
    expect(JSON.stringify(parsed.error)).not.toContain(FAKE_SECRET_SHAPED);
  });

  it("prefers the secret-seed error when the batch is also too long", () => {
    const rows = Array.from({ length: MAX_BATCH_ENTRIES }, (_, index) => `bad-${index}`);
    rows.push(FAKE_SECRET_SHAPED);
    const parsed = validateBatchAddressValidatorInput(rows.join("\n"));

    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error.code).toBe("contains_secret_seed");
    expect(JSON.stringify(parsed)).not.toContain(FAKE_SECRET_SHAPED);
  });

  it("returns trimmed public keys in order", () => {
    const alpha = publicKeyFromFixedSeed(1);
    const parsed = validateBatchAddressValidatorInput(`  ${alpha}  `);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.input.entries).toEqual([{ value: alpha, line: 1, index: 0 }]);
  });
});
