import { describe, expect, it } from "vitest";
import { formatOperationTime, shortAccountId, transactionExplorerUrl } from "@/app/tools/operation-browser/lib/format";
import { copy } from "@/app/tools/operation-browser/copy";
import { accountId } from "./fixtures/known-operations.fixture";

describe("presentation formatting", () => {
  it("formats timestamps in UTC", () => {
    expect(formatOperationTime("2026-10-20T15:00:00+03:00")).toBe("Oct 20, 2026, 12:00 PM UTC");
  });
  it("uses a fallback for absent or malformed timestamps", () => {
    expect(formatOperationTime(null)).toBe(copy.timeUnavailable);
    expect(formatOperationTime("bad date")).toBe(copy.timeUnavailable);
  });
  it("shortens public account IDs consistently", () => {
    expect(shortAccountId(accountId)).toBe("GCNL55…23WOTE");
  });
  it("builds Stellar Expert transaction links per network", () => {
    const hash = "a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef";
    expect(transactionExplorerUrl("testnet", hash)).toBe(`https://stellar.expert/explorer/testnet/tx/${hash}`);
    expect(transactionExplorerUrl("mainnet", hash)).toBe(`https://stellar.expert/explorer/public/tx/${hash}`);
  });
});
