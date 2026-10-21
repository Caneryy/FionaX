import { describe, expect, it } from "vitest";
import { formatByteLength, formatDecodedValue, formatEncoding, formatEntryCount, formatNetworkName } from "@/app/tools/account-data-entries/lib/format";
import { copy } from "@/app/tools/account-data-entries/copy";

describe("account data entry formatting", () => {
  it("formats a byte length exactly", () => {
    expect(formatByteLength(64)).toBe("64 bytes");
    expect(formatByteLength(0)).toBe("0 bytes");
  });

  it("uses the copy labels for encoding and network", () => {
    expect(formatEncoding("text")).toBe(copy.encoding.text);
    expect(formatEncoding("binary")).toBe(copy.encoding.binary);
    expect(formatNetworkName("testnet")).toBe(copy.networkNames.testnet);
    expect(formatNetworkName("mainnet")).toBe(copy.networkNames.mainnet);
  });

  it("shows text for UTF-8 and hex for binary", () => {
    expect(formatDecodedValue("text", "hello", "68656c6c6f")).toBe("hello");
    expect(formatDecodedValue("binary", null, "fffe")).toBe("fffe");
  });

  it("formats the entry count as a decimal string", () => {
    expect(formatEntryCount(0)).toBe("0");
    expect(formatEntryCount(2)).toBe("2");
  });
});
