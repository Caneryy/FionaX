import type { DecodedMemo, MemoKind } from "@/app/tools/memo-inspector/types";

export interface MemoRenderRules {
  kind: MemoKind;
  showText: boolean;
  showId: boolean;
  showHexBase64: boolean;
  showBinaryNotice: boolean;
  showNoneState: boolean;
  /** Explicit label for hash vs return — never infer one from the other. */
  typeLabelKey: MemoKind;
}

/**
 * Apply type-specific rendering rules for the decoded memo.
 * Hash and return share encodings but keep distinct labels.
 */
export function applyMemoTypeRules(memo: DecodedMemo): MemoRenderRules {
  switch (memo.kind) {
    case "none":
      return {
        kind: "none",
        showText: false,
        showId: false,
        showHexBase64: false,
        showBinaryNotice: false,
        showNoneState: true,
        typeLabelKey: "none"
      };
    case "text":
      return {
        kind: "text",
        showText: !memo.binary,
        showId: false,
        showHexBase64: false,
        showBinaryNotice: memo.binary,
        showNoneState: false,
        typeLabelKey: "text"
      };
    case "id":
      return {
        kind: "id",
        showText: false,
        showId: true,
        showHexBase64: false,
        showBinaryNotice: false,
        showNoneState: false,
        typeLabelKey: "id"
      };
    case "hash":
      return {
        kind: "hash",
        showText: false,
        showId: false,
        showHexBase64: true,
        showBinaryNotice: false,
        showNoneState: false,
        typeLabelKey: "hash"
      };
    case "return":
      return {
        kind: "return",
        showText: false,
        showId: false,
        showHexBase64: true,
        showBinaryNotice: false,
        showNoneState: false,
        typeLabelKey: "return"
      };
  }
}

export function shouldShowEncodings(kind: MemoKind): boolean {
  return kind === "hash" || kind === "return";
}
