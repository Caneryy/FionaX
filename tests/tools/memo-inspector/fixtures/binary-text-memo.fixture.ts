import { fixtureHash, fixtureSource } from "./text-memo.fixture";

/**
 * Text memo carrying a NUL byte — not printable UTF-8, so the tool flags binary.
 * Horizon may still surface this as a JSON string with an embedded control character.
 */
export const binaryTextMemoValue = "pay\u0000load";

export const binaryTextMemoTransaction = {
  hash: fixtureHash,
  memo_type: "text",
  memo: binaryTextMemoValue,
  source_account: fixtureSource,
  created_at: "2024-08-20T16:45:00Z",
  successful: true
};

/** Raw bytes that are not valid UTF-8 (0xff lead). Used by unit decode tests. */
export const invalidUtf8Bytes = new Uint8Array([0xff, 0xfe, 0xfd, 0x00]);
