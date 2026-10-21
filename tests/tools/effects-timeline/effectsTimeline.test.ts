import { describe, expect, it, vi } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { runEffectsTimeline } from "@/app/tools/effects-timeline/lib/effectsTimeline";
import { copy } from "@/app/tools/effects-timeline/copy";
import { accountId, knownEffects, pageOf } from "./fixtures/known-effects.fixture";
import { unknownEffect } from "./fixtures/unknown-effect.fixture";
import { firstPage, secondPage } from "./fixtures/paginated-effects.fixture";

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("runEffectsTimeline", () => {
  it("fetches newest effects and decodes only description fields", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      void input;
      return reply(pageOf(knownEffects));
    });
    const outcome = await runEffectsTimeline(accountId, "testnet", undefined, fetcher);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(fetcher).toHaveBeenCalledOnce();
    const url = new URL(fetcher.mock.calls[0][0] as string);
    expect(url.pathname).toBe(`/accounts/${accountId}/effects`);
    expect(url.searchParams.get("order")).toBe("desc");
    expect(url.searchParams.get("limit")).toBe("20");
    expect(outcome.result.effects[0]).toEqual({
      pagingToken: "110694007436259330-2",
      type: "account_credited",
      createdAt: "2026-10-20T12:00:00Z",
      details: { asset_type: "native", amount: "0.0000001" }
    });
    expect(outcome.result.nextCursor).toBeNull();
  });

  it("rejects a secret seed before calling Horizon", async () => {
    const fetcher = vi.fn();
    const outcome = await runEffectsTimeline(Keypair.random().secret(), "testnet", undefined, fetcher);
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
    const outcome = await runEffectsTimeline(accountId, "testnet", undefined, async () => reply({}, status));
    expect(outcome).toEqual({ ok: false, error: { code } });
    expect(copy.errors[code].length).toBeGreaterThan(20);
  });

  it("maps transport failure and malformed records separately", async () => {
    expect(await runEffectsTimeline(accountId, "testnet", undefined, async () => { throw new Error("offline"); }))
      .toEqual({ ok: false, error: { code: "request_failed" } });
    expect(await runEffectsTimeline(accountId, "testnet", undefined, async () => reply(pageOf([{ type: "account_credited" }]))))
      .toEqual({ ok: false, error: { code: "malformed_effect" } });
    expect(copy.errors.malformed_effect).toContain("incomplete effect");
    expect(await runEffectsTimeline(accountId, "testnet", undefined, async () => new Response("broken JSON")))
      .toEqual({ ok: false, error: { code: "malformed_effect" } });
  });

  it("distinguishes an existing account with no effects from a missing account", async () => {
    const empty = await runEffectsTimeline(accountId, "testnet", undefined, async () => reply(pageOf([])));
    expect(empty.ok && empty.result.effects).toEqual([]);
    expect(empty.ok && empty.result.nextCursor).toBeNull();
    expect(copy.emptyTitle).not.toBe(copy.errors.account_not_found);
  });

  it("preserves unknown effect types", async () => {
    const outcome = await runEffectsTimeline(accountId, "testnet", undefined, async () => reply(pageOf([unknownEffect])));
    expect(outcome.ok && outcome.result.effects[0].type).toBe("future_effect");
  });

  it("loads an older page with the hyphenated cursor and removes duplicate tokens", async () => {
    const first = await runEffectsTimeline(accountId, "testnet", undefined, async () => reply(pageOf(firstPage)));
    expect(first.ok).toBe(true);
    if (!first.ok || !first.result.nextCursor) return;
    expect(first.result.nextCursor).toBe("110694007436259311-2");
    const secondFetcher = vi.fn(async (input: RequestInfo | URL) => {
      void input;
      return reply(pageOf(secondPage));
    });
    const older = await runEffectsTimeline(accountId, "testnet", { effects: first.result.effects, cursor: first.result.nextCursor }, secondFetcher);
    expect(older.ok).toBe(true);
    if (!older.ok) return;
    expect(new URL(secondFetcher.mock.calls[0][0] as string).searchParams.get("cursor")).toBe(first.result.nextCursor);
    expect(older.result.effects).toHaveLength(21);
    expect(older.result.effects.map((effect) => effect.pagingToken)).toEqual(Array.from(new Set(older.result.effects.map((effect) => effect.pagingToken))));
    expect(older.result.nextCursor).toBeNull();
  });
});
