import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/batch-address-validator/copy";
import { runBatchAddressValidator } from "@/app/tools/batch-address-validator/lib/batchAddressValidator";
import {
  BatchAddressValidatorFailure,
  toToolError,
  toolError
} from "@/app/tools/batch-address-validator/lib/batchAddressValidator.errors";
import { validateBatchAddressValidatorInput } from "@/app/tools/batch-address-validator/schema";
import type { BatchAddressValidatorErrorCode } from "@/app/tools/batch-address-validator/types";
import { duplicateBatchKeys, duplicateBatchRaw } from "@/tests/tools/batch-address-validator/fixtures/duplicate-batch.fixture";
import {
  mixedBatchKeys,
  mixedBatchMalformed,
  mixedBatchRaw
} from "@/tests/tools/batch-address-validator/fixtures/mixed-batch.fixture";
import { offlineNetworkFixture } from "@/tests/tools/batch-address-validator/fixtures/offline-network.fixture";
import { FAKE_SECRET_SHAPED } from "@/tests/tools/batch-address-validator/fixtures/secret-seed-batch.fixture";

const ERROR_CODES: BatchAddressValidatorErrorCode[] = [
  "empty_batch",
  "too_many_entries",
  "contains_secret_seed",
  "invalid_address",
  "duplicate_address"
];

function toolSource(): string {
  const root = path.join(process.cwd(), "app/tools/batch-address-validator");
  const files: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) files.push(full);
    }
  }

  walk(root);
  return files.map((file) => readFileSync(file, "utf8")).join("\n");
}

describe("runBatchAddressValidator", () => {
  it("maps every error code to actionable copy", () => {
    for (const code of ERROR_CODES) {
      const error = toolError(code);
      expect(error.message).toBe(copy.errors[code]);
      expect(error.message.length).toBeGreaterThan(20);
    }
  });

  it("classifies a mixed batch in input order", () => {
    const parsed = validateBatchAddressValidatorInput(mixedBatchRaw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const result = runBatchAddressValidator(parsed.input);

    expect(result.rows.map((row) => ({ line: row.line, index: row.index, status: row.status, code: row.code }))).toEqual([
      { line: 1, index: 0, status: "valid", code: null },
      { line: 2, index: 1, status: "invalid", code: "invalid_address" },
      { line: 3, index: 2, status: "invalid", code: "invalid_address" },
      { line: 4, index: 3, status: "valid", code: null }
    ]);
    expect(result.rows[0]?.value).toBe(mixedBatchKeys.alpha);
    expect(result.rows[2]?.value).toBe(mixedBatchMalformed);
    expect(result.summary).toEqual({ total: 4, valid: 2, invalid: 2, duplicate: 0 });
  });

  it("reports duplicate valid addresses apart from invalid ones", () => {
    const parsed = validateBatchAddressValidatorInput(duplicateBatchRaw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const result = runBatchAddressValidator(parsed.input);

    expect(result.rows.map((row) => row.status)).toEqual(["valid", "valid", "duplicate", "invalid", "duplicate"]);
    expect(result.rows[2]?.code).toBe("duplicate_address");
    expect(result.rows[2]?.value).toBe(duplicateBatchKeys.alpha);
    expect(result.rows[2]?.line).toBe(1);
    expect(result.rows[4]?.line).toBe(3);
    expect(result.rows[4]?.value).toBe(duplicateBatchKeys.beta);
    expect(result.summary).toEqual({ total: 5, valid: 2, invalid: 1, duplicate: 2 });
  });

  it("does not build rows when a secret-shaped value is supplied directly", () => {
    expect(() =>
      runBatchAddressValidator({
        entries: [
          { value: mixedBatchKeys.alpha, line: 1, index: 0 },
          { value: FAKE_SECRET_SHAPED, line: 2, index: 1 }
        ]
      })
    ).toThrow(BatchAddressValidatorFailure);
  });

  it("drops decoder text that might contain a secret", () => {
    const error = toToolError(new Error(FAKE_SECRET_SHAPED));

    expect(error.code).toBe("invalid_address");
    expect(error.message).toBe(copy.errors.invalid_address);
    expect(JSON.stringify(error)).not.toContain(FAKE_SECRET_SHAPED);
  });

  it("maps a tool failure without copying its message", () => {
    const error = toToolError(new BatchAddressValidatorFailure("contains_secret_seed"));

    expect(error).toEqual(toolError("contains_secret_seed"));
  });

  it("makes no Horizon or RPC request", () => {
    const source = toolSource();

    expect(source).not.toMatch(/\bfetch\s*\(/);
    expect(source.toLowerCase()).not.toContain("horizon");
    expect(source.toLowerCase()).not.toContain("soroban");
    expect(offlineNetworkFixture.horizonRequests).toEqual([]);
    expect(offlineNetworkFixture.rpcRequests).toEqual([]);
  });
});
