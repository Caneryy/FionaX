import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/memo-inspector/copy";
import { validateMemoInspectorInput } from "@/app/tools/memo-inspector/schema";
import { fixtureHash } from "./fixtures/text-memo.fixture";

describe("validateMemoInspectorInput", () => {
  it("rejects empty and malformed hashes", () => {
    const empty = validateMemoInspectorInput(" ");
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.error).toEqual({ code: "invalid_hash", message: copy.errors.invalid_hash.empty });

    const short = validateMemoInspectorInput("abcd");
    expect(short.ok).toBe(false);
    if (!short.ok) expect(short.error.message).toBe(copy.errors.invalid_hash.malformed);

    const withSpaces = validateMemoInspectorInput(`${fixtureHash.slice(0, 32)} ${fixtureHash.slice(32)}`);
    expect(withSpaces.ok).toBe(false);
  });

  it("accepts a trimmed 64-character hex hash and lowercases it", () => {
    expect(validateMemoInspectorInput(` ${fixtureHash.toUpperCase()} `)).toEqual({
      ok: true,
      input: { hash: fixtureHash.toLowerCase() }
    });
  });
});
