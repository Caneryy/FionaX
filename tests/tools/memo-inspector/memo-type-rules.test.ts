import { describe, expect, it } from "vitest";
import { applyMemoTypeRules, shouldShowEncodings } from "@/app/tools/memo-inspector/lib/memo-type-rules";
import type { DecodedMemo } from "@/app/tools/memo-inspector/types";

describe("memo-type-rules", () => {
  it("shows none state only for none memos", () => {
    const rules = applyMemoTypeRules({ kind: "none" });
    expect(rules.showNoneState).toBe(true);
    expect(rules.showHexBase64).toBe(false);
    expect(rules.typeLabelKey).toBe("none");
  });

  it("flags binary text and keeps hash/return labels distinct", () => {
    const binaryText: DecodedMemo = { kind: "text", raw: "", text: null, binary: true, hex: "00" };
    expect(applyMemoTypeRules(binaryText)).toMatchObject({
      showText: false,
      showBinaryNotice: true,
      typeLabelKey: "text"
    });

    const hash: DecodedMemo = { kind: "hash", rawBase64: "AA==", hex: "00", base64: "AA==" };
    const ret: DecodedMemo = { kind: "return", rawBase64: "AA==", hex: "00", base64: "AA==" };
    expect(applyMemoTypeRules(hash).typeLabelKey).toBe("hash");
    expect(applyMemoTypeRules(ret).typeLabelKey).toBe("return");
    expect(shouldShowEncodings("hash")).toBe(true);
    expect(shouldShowEncodings("return")).toBe(true);
    expect(shouldShowEncodings("text")).toBe(false);
  });

  it("shows id and printable text appropriately", () => {
    expect(applyMemoTypeRules({ kind: "id", raw: "1", id: "1" }).showId).toBe(true);
    expect(
      applyMemoTypeRules({ kind: "text", raw: "hi", text: "hi", binary: false, hex: "6869" })
    ).toMatchObject({ showText: true, showBinaryNotice: false });
  });
});
