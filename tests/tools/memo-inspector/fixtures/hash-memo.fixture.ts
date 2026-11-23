import { fixtureHash, fixtureSource } from "./text-memo.fixture";

/** 32 zero bytes as base64 — typical Horizon hash/return payload shape. */
export const thirtyTwoZeroBytesBase64 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

export const hashMemoTransaction = {
  hash: fixtureHash,
  memo_type: "hash",
  memo: thirtyTwoZeroBytesBase64,
  source_account: fixtureSource,
  created_at: "2024-07-15T08:30:00Z",
  successful: true
};

export const returnMemoTransaction = {
  hash: fixtureHash,
  memo_type: "return",
  memo: thirtyTwoZeroBytesBase64,
  source_account: fixtureSource,
  created_at: "2024-07-15T08:30:00Z",
  successful: true
};

export const expectedHashHex = "00".repeat(32);
