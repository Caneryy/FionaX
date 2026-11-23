import { describe, expect, it, vi } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { runOperationBrowser } from "@/app/tools/operation-browser/lib/operationBrowser";
import { copy } from "@/app/tools/operation-browser/copy";
import { accountId, knownOperations, pageOf } from "./fixtures/known-operations.fixture";
import { unknownOperation } from "./fixtures/unknown-operation.fixture";
import { firstPage, secondPage } from "./fixtures/paginated-operations.fixture";

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("runOperationBrowser", () => {
  it("fetches newest operations and decodes only summary fields", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      void input;
      return reply(pageOf(knownOperations));
    });
    const outcome = await runOperationBrowser(accountId, "testnet", undefined, fetcher);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(fetcher).toHaveBeenCalledOnce();
    const url = new URL(fetcher.mock.calls[0][0] as string);
    expect(url.pathname).toBe(`/accounts/${accountId}/operations`);
    expect(url.searchParams.get("order")).toBe("desc");
    expect(url.searchParams.get("limit")).toBe("20");
    expect(outcome.result.operations[0]).toEqual({
      pagingToken: "110694007436259330",
      type: "payment",
      createdAt: "2026-10-20T12:00:00Z",
      transactionHash: "a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef",
      details: {
        asset_type: "native",
        amount: "0.0000001",
        destination: "GDQNY3PBOJOKYZSRMK2S7LHHGWZIUISD4QORETLMXEWXBI7KFZZMKTL3"
      }
    });
    expect(outcome.result.nextCursor).toBeNull();
  });

  it("rejects a secret seed before calling Horizon", async () => {
    const fetcher = vi.fn();
    const outcome = await runOperationBrowser(Keypair.random().secret(), "testnet", undefined, fetcher);
    expect(outcome).toEqual({ ok: false, error: { code: "invalid_account" } });
    expect(copy.errors.invalid_account).toContain("Secret seeds");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    [404, "account_not_found"],
    [400, "invalid_cursor"],
    [429, "rate_limited"],
    [500, "request_failed"]
  ] as const)("maps HTTP %i to %s and actionable copy", async (status, code) => {
    const outcome = await runOperationBrowser(accountId, "testnet", undefined, async () => reply({}, status));
    expect(outcome).toEqual({ ok: false, error: { code } });
    expect(copy.errors[code].length).toBeGreaterThan(20);
  });

  it("maps transport failure and malformed records separately", async () => {
    expect(await runOperationBrowser(accountId, "testnet", undefined, async () => { throw new Error("offline"); }))
      .toEqual({ ok: false, error: { code: "request_failed" } });
    expect(await runOperationBrowser(accountId, "testnet", undefined, async () => reply(pageOf([{ type: "payment" }]))))
      .toEqual({ ok: false, error: { code: "malformed_operation" } });
    expect(copy.errors.malformed_operation).toContain("incomplete operation");
    expect(await runOperationBrowser(accountId, "testnet", undefined, async () => new Response("broken JSON")))
      .toEqual({ ok: false, error: { code: "malformed_operation" } });
  });

  it("distinguishes an existing account with no operations from a missing account", async () => {
    const empty = await runOperationBrowser(accountId, "testnet", undefined, async () => reply(pageOf([])));
    expect(empty.ok && empty.result.operations).toEqual([]);
    expect(empty.ok && empty.result.nextCursor).toBeNull();
    expect(copy.emptyTitle).not.toBe(copy.errors.account_not_found);
  });

  it("preserves unknown operation types", async () => {
    const outcome = await runOperationBrowser(accountId, "testnet", undefined, async () => reply(pageOf([unknownOperation])));
    expect(outcome.ok && outcome.result.operations[0].type).toBe("future_operation");
  });

  it("loads an older page with the numeric cursor and removes duplicate tokens", async () => {
    const first = await runOperationBrowser(accountId, "testnet", undefined, async () => reply(pageOf(firstPage)));
    expect(first.ok).toBe(true);
    if (!first.ok || !first.result.nextCursor) return;
    expect(first.result.nextCursor).toBe("110694007436259311");
    const secondFetcher = vi.fn(async (input: RequestInfo | URL) => {
      void input;
      return reply(pageOf(secondPage));
    });
    const older = await runOperationBrowser(accountId, "testnet", { operations: first.result.operations, cursor: first.result.nextCursor }, secondFetcher);
    expect(older.ok).toBe(true);
    if (!older.ok) return;
    expect(new URL(secondFetcher.mock.calls[0][0] as string).searchParams.get("cursor")).toBe(first.result.nextCursor);
    expect(older.result.operations).toHaveLength(21);
    expect(older.result.operations.map((operation) => operation.pagingToken)).toEqual(Array.from(new Set(older.result.operations.map((operation) => operation.pagingToken))));
    expect(older.result.nextCursor).toBeNull();
  });
});
