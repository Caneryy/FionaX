import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/memo-inspector/copy";
import { runMemoInspector } from "@/app/tools/memo-inspector/lib/memoInspector";
import { toToolError, MemoInspectorFailure } from "@/app/tools/memo-inspector/lib/memoInspector.errors";
import { MalformedMemoError } from "@/app/tools/memo-inspector/lib/memo-decode";
import { binaryTextMemoTransaction } from "./fixtures/binary-text-memo.fixture";
import {
  expectedHashHex,
  hashMemoTransaction,
  returnMemoTransaction,
  thirtyTwoZeroBytesBase64
} from "./fixtures/hash-memo.fixture";
import {
  fixtureHash,
  idMemoTransaction,
  noneMemoTransaction,
  textMemoTransaction
} from "./fixtures/text-memo.fixture";

function jsonFetch(status: number, body: unknown): typeof fetch {
  return (async () =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })) as typeof fetch;
}

describe("runMemoInspector", () => {
  it("decodes a text memo", async () => {
    const outcome = await runMemoInspector(fixtureHash, {
      network: "testnet",
      fetchImpl: jsonFetch(200, textMemoTransaction)
    });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.memoType).toBe("text");
      expect(outcome.result.memo).toMatchObject({ kind: "text", text: "invoice-42", binary: false });
    }
  });

  it("treats memo type none as success, not an error", async () => {
    const outcome = await runMemoInspector(fixtureHash, {
      network: "testnet",
      fetchImpl: jsonFetch(200, noneMemoTransaction)
    });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) expect(outcome.result.memo).toEqual({ kind: "none" });
  });

  it("decodes id, hash, and return memos with type-specific fields", async () => {
    const idOutcome = await runMemoInspector(fixtureHash, {
      network: "mainnet",
      fetchImpl: jsonFetch(200, idMemoTransaction)
    });
    expect(idOutcome.ok).toBe(true);
    if (idOutcome.ok) {
      expect(idOutcome.result.memo).toEqual({ kind: "id", raw: "18446744073709551615", id: "18446744073709551615" });
      expect(idOutcome.result.successful).toBe(false);
    }

    const hashOutcome = await runMemoInspector(fixtureHash, {
      network: "testnet",
      fetchImpl: jsonFetch(200, hashMemoTransaction)
    });
    expect(hashOutcome.ok).toBe(true);
    if (hashOutcome.ok) {
      expect(hashOutcome.result.memo).toEqual({
        kind: "hash",
        rawBase64: thirtyTwoZeroBytesBase64,
        hex: expectedHashHex,
        base64: thirtyTwoZeroBytesBase64
      });
    }

    const returnOutcome = await runMemoInspector(fixtureHash, {
      network: "testnet",
      fetchImpl: jsonFetch(200, returnMemoTransaction)
    });
    expect(returnOutcome.ok).toBe(true);
    if (returnOutcome.ok) expect(returnOutcome.result.memo.kind).toBe("return");
  });

  it("flags binary text memos instead of showing corrupted text", async () => {
    const outcome = await runMemoInspector(fixtureHash, {
      network: "testnet",
      fetchImpl: jsonFetch(200, binaryTextMemoTransaction)
    });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.memo).toMatchObject({ kind: "text", binary: true, text: null });
    }
  });

  it("covers the error codes", async () => {
    const invalid = await runMemoInspector("not-a-hash", { network: "testnet", fetchImpl: jsonFetch(200, textMemoTransaction) });
    expect(invalid).toEqual({
      ok: false,
      error: { code: "invalid_hash", message: copy.errors.invalid_hash.malformed }
    });

    const missing = await runMemoInspector(fixtureHash, {
      network: "testnet",
      fetchImpl: jsonFetch(404, { title: "missing" })
    });
    expect(missing).toEqual({
      ok: false,
      error: { code: "transaction_not_found", message: copy.errors.transaction_not_found }
    });

    const limited = await runMemoInspector(fixtureHash, {
      network: "testnet",
      fetchImpl: jsonFetch(429, { title: "limit" })
    });
    expect(limited).toEqual({ ok: false, error: { code: "rate_limited", message: copy.errors.rate_limited } });

    const malformed = await runMemoInspector(fixtureHash, {
      network: "testnet",
      fetchImpl: jsonFetch(200, {
        hash: fixtureHash,
        memo_type: "hash",
        memo: "not-32-bytes",
        source_account: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
        created_at: "2024-01-01T00:00:00Z",
        successful: true
      })
    });
    expect(malformed).toEqual({
      ok: false,
      error: { code: "malformed_memo", message: copy.errors.malformed_memo }
    });

    const offline = (async () => {
      throw new Error("offline");
    }) as typeof fetch;
    const failed = await runMemoInspector(fixtureHash, { network: "testnet", fetchImpl: offline });
    expect(failed).toEqual({ ok: false, error: { code: "request_failed", message: copy.errors.request_failed } });

    expect(toToolError(new MalformedMemoError()).code).toBe("malformed_memo");
    expect(toToolError(new MemoInspectorFailure("transaction_not_found")).code).toBe("transaction_not_found");
  });
});
