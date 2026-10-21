import { describe, expect, it } from "vitest";
import { entryNameBytes, isNearNameLimit, isOverNameLimit } from "@/app/tools/account-data-entries/lib/entry-limits";
import { NAME_BYTE_LIMIT, NAME_NEAR_LIMIT } from "@/app/tools/account-data-entries/types";

describe("entry name limits", () => {
  it("counts UTF-8 bytes rather than UTF-16 code units", () => {
    expect(entryNameBytes("é")).toBe(2);
    expect(entryNameBytes("ok")).toBe(2);
  });

  it("flags a name at the near-limit boundary and at 64 bytes", () => {
    expect(isNearNameLimit("a".repeat(NAME_NEAR_LIMIT - 1))).toBe(false);
    expect(isNearNameLimit("a".repeat(NAME_NEAR_LIMIT))).toBe(true);
    expect(isNearNameLimit("a".repeat(NAME_BYTE_LIMIT))).toBe(true);
  });

  it("does not call a 64-byte name over the limit", () => {
    expect(isOverNameLimit("a".repeat(NAME_BYTE_LIMIT))).toBe(false);
    expect(isOverNameLimit("a".repeat(NAME_BYTE_LIMIT + 1))).toBe(true);
  });
});
