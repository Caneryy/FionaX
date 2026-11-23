import {
  bytesToBase64,
  bytesToHex,
  decodeBase64ToBytes,
  detectBinaryText
} from "@/app/tools/memo-inspector/lib/binary-detect";
import type { DecodedMemo, MemoKind } from "@/app/tools/memo-inspector/types";

export class MalformedMemoError extends Error {
  readonly code = "malformed_memo" as const;

  constructor() {
    super("malformed_memo");
    this.name = "MalformedMemoError";
  }
}

const KNOWN_TYPES = new Set<MemoKind>(["none", "text", "id", "hash", "return"]);

export function normalizeMemoType(raw: unknown): MemoKind | null {
  if (typeof raw !== "string") return null;
  const lower = raw.trim().toLowerCase();
  return KNOWN_TYPES.has(lower as MemoKind) ? (lower as MemoKind) : null;
}

/**
 * Decode the memo by its declared Horizon type.
 * Hash and return share the same 32-byte shape; only the type label differs.
 */
export function decodeMemo(memoType: MemoKind, memoValue: unknown): DecodedMemo {
  if (memoType === "none") {
    if (memoValue !== undefined && memoValue !== null && memoValue !== "") {
      throw new MalformedMemoError();
    }
    return { kind: "none" };
  }

  if (memoType === "text") {
    return decodeTextMemo(memoValue);
  }

  if (memoType === "id") {
    return decodeIdMemo(memoValue);
  }

  return decodeHashOrReturn(memoType, memoValue);
}

function decodeTextMemo(memoValue: unknown): DecodedMemo {
  if (typeof memoValue !== "string") {
    throw new MalformedMemoError();
  }

  const bytes = new TextEncoder().encode(memoValue);
  const detection = detectBinaryText(bytes);

  return {
    kind: "text",
    raw: memoValue,
    text: detection.text,
    binary: detection.binary,
    hex: bytesToHex(bytes)
  };
}

/**
 * Detect binary when Horizon hands back Latin-1 / byte-preserving text that
 * is not valid printable UTF-8. Callers that already have raw bytes can pass
 * them through `decodeTextMemoBytes`.
 */
export function decodeTextMemoBytes(bytes: Uint8Array, rawFallback = ""): DecodedMemo {
  const detection = detectBinaryText(bytes);
  return {
    kind: "text",
    raw: detection.text ?? rawFallback,
    text: detection.text,
    binary: detection.binary,
    hex: bytesToHex(bytes)
  };
}

function decodeIdMemo(memoValue: unknown): DecodedMemo {
  if (typeof memoValue === "number") {
    if (!Number.isInteger(memoValue) || memoValue < 0) {
      throw new MalformedMemoError();
    }
    return { kind: "id", raw: String(memoValue), id: String(memoValue) };
  }

  if (typeof memoValue === "string") {
    const trimmed = memoValue.trim();
    if (!/^\d+$/.test(trimmed)) {
      throw new MalformedMemoError();
    }
    try {
      const id = BigInt(trimmed);
      if (id < 0n) throw new MalformedMemoError();
      return { kind: "id", raw: trimmed, id: id.toString() };
    } catch {
      throw new MalformedMemoError();
    }
  }

  throw new MalformedMemoError();
}

function decodeHashOrReturn(kind: "hash" | "return", memoValue: unknown): DecodedMemo {
  if (typeof memoValue !== "string" || memoValue.trim().length === 0) {
    throw new MalformedMemoError();
  }

  const trimmed = memoValue.trim();
  let bytes = decodeBase64ToBytes(trimmed);

  // Some Horizon payloads expose a 64-char hex digest instead of base64.
  if (!bytes && /^[a-fA-F0-9]{64}$/.test(trimmed)) {
    bytes = hexToBytes(trimmed);
  }

  if (!bytes || bytes.length !== 32) {
    throw new MalformedMemoError();
  }

  const hex = bytesToHex(bytes);
  const base64 = bytesToBase64(bytes);

  return kind === "hash"
    ? { kind: "hash", rawBase64: base64, hex, base64 }
    : { kind: "return", rawBase64: base64, hex, base64 };
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}
