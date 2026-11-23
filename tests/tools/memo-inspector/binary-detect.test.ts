import { describe, expect, it } from "vitest";
import {
  bytesToBase64,
  bytesToHex,
  decodeBase64ToBytes,
  decodeUtf8,
  detectBinaryText,
  isPrintableUtf8
} from "@/app/tools/memo-inspector/lib/binary-detect";
import { invalidUtf8Bytes } from "./fixtures/binary-text-memo.fixture";
import { thirtyTwoZeroBytesBase64 } from "./fixtures/hash-memo.fixture";

describe("binary-detect", () => {
  it("accepts printable UTF-8 text", () => {
    const bytes = new TextEncoder().encode("hello memo");
    expect(detectBinaryText(bytes)).toEqual({ binary: false, text: "hello memo" });
    expect(isPrintableUtf8("hello memo", bytes)).toBe(true);
  });

  it("flags NUL and invalid UTF-8 as binary", () => {
    const withNul = new TextEncoder().encode("a\u0000b");
    expect(detectBinaryText(withNul)).toEqual({ binary: true, text: null });

    expect(decodeUtf8(invalidUtf8Bytes)).toBeNull();
    expect(detectBinaryText(invalidUtf8Bytes)).toEqual({ binary: true, text: null });
  });

  it("round-trips base64 and hex helpers", () => {
    const bytes = decodeBase64ToBytes(thirtyTwoZeroBytesBase64);
    expect(bytes).not.toBeNull();
    if (!bytes) return;
    expect(bytes.length).toBe(32);
    expect(bytesToHex(bytes)).toBe("00".repeat(32));
    expect(bytesToBase64(bytes)).toBe(thirtyTwoZeroBytesBase64);
    expect(decodeBase64ToBytes("!!!")).toBeNull();
  });
});
