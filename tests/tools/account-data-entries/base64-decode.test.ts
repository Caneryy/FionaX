import { describe, expect, it } from "vitest";
import { decodeDataValue } from "@/app/tools/account-data-entries/lib/base64-decode";
import { binaryEntryBase64, binaryEntryHex } from "./fixtures/binary-entry.fixture";
import { textEntryBase64, textEntryValue } from "./fixtures/text-entries.fixture";

describe("decodeDataValue", () => {
  it("decodes printable UTF-8 and keeps the raw bytes", () => {
    const decoded = decodeDataValue(textEntryBase64);

    expect(decoded.ok).toBe(true);

    if (decoded.ok) {
      expect(decoded.encoding).toBe("text");
      expect(decoded.text).toBe(textEntryValue);
    }
  });

  it("marks non-UTF-8 bytes as binary instead of throwing", () => {
    const decoded = decodeDataValue(binaryEntryBase64);

    expect(decoded.ok).toBe(true);

    if (decoded.ok) {
      expect(decoded.encoding).toBe("binary");
      expect(decoded.text).toBeNull();
      expect(decoded.hex).toBe(binaryEntryHex);
    }
  });

  it("rejects a value that is not base64", () => {
    expect(decodeDataValue("not base64!!!").ok).toBe(false);
  });

  it("treats an empty string as empty text", () => {
    const decoded = decodeDataValue("");

    expect(decoded.ok).toBe(true);

    if (decoded.ok) {
      expect(decoded.encoding).toBe("text");
      expect(decoded.text).toBe("");
      expect(decoded.hex).toBe("");
    }
  });
});
