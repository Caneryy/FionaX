import { describe, expect, it } from "vitest";
import {
  decodeMemo,
  decodeTextMemoBytes,
  MalformedMemoError,
  normalizeMemoType
} from "@/app/tools/memo-inspector/lib/memo-decode";
import { invalidUtf8Bytes } from "./fixtures/binary-text-memo.fixture";
import { expectedHashHex, thirtyTwoZeroBytesBase64 } from "./fixtures/hash-memo.fixture";

describe("memo-decode", () => {
  it("normalizes known memo types", () => {
    expect(normalizeMemoType("TEXT")).toBe("text");
    expect(normalizeMemoType("return")).toBe("return");
    expect(normalizeMemoType("unknown")).toBeNull();
  });

  it("decodes none, text, and id memos", () => {
    expect(decodeMemo("none", undefined)).toEqual({ kind: "none" });
    expect(decodeMemo("text", "ok")).toMatchObject({ kind: "text", text: "ok", binary: false });
    expect(decodeMemo("id", "99")).toEqual({ kind: "id", raw: "99", id: "99" });
    expect(decodeMemo("id", 7)).toEqual({ kind: "id", raw: "7", id: "7" });
  });

  it("decodes hash and return with both encodings", () => {
    const hash = decodeMemo("hash", thirtyTwoZeroBytesBase64);
    expect(hash).toEqual({
      kind: "hash",
      rawBase64: thirtyTwoZeroBytesBase64,
      hex: expectedHashHex,
      base64: thirtyTwoZeroBytesBase64
    });

    const ret = decodeMemo("return", thirtyTwoZeroBytesBase64);
    expect(ret.kind).toBe("return");
    if (ret.kind === "return") {
      expect(ret.hex).toBe(expectedHashHex);
      expect(ret.base64).toBe(thirtyTwoZeroBytesBase64);
    }
  });

  it("flags invalid UTF-8 text bytes as binary", () => {
    const decoded = decodeTextMemoBytes(invalidUtf8Bytes);
    expect(decoded).toMatchObject({ kind: "text", binary: true, text: null });
  });

  it("rejects malformed payloads", () => {
    expect(() => decodeMemo("none", "surprise")).toThrow(MalformedMemoError);
    expect(() => decodeMemo("text", 12)).toThrow(MalformedMemoError);
    expect(() => decodeMemo("id", "-1")).toThrow(MalformedMemoError);
    expect(() => decodeMemo("hash", "short")).toThrow(MalformedMemoError);
  });
});
