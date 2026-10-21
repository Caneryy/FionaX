import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/asset-flags-inspector/copy";
import {
  formatBitmaskDecimal,
  formatBitmaskHex,
  formatBitmaskLabel,
  formatFlagState,
  formatNetworkName,
  formatSequence
} from "@/app/tools/asset-flags-inspector/lib/format";

describe("format helpers", () => {
  it("labels set and unset flags", () => {
    expect(formatFlagState(true)).toBe("On");
    expect(formatFlagState(false)).toBe("Off");
    expect(formatFlagState(true)).toBe(copy.flagState.on);
    expect(formatFlagState(false)).toBe(copy.flagState.off);
  });

  it("prints the raw bitmask as decimal and hex", () => {
    expect(formatBitmaskDecimal(15n)).toBe("15");
    expect(formatBitmaskHex(15n)).toBe("0xf");
    expect(formatBitmaskLabel(15n)).toBe("15 (0xf)");
    expect(formatBitmaskLabel(0n)).toBe("0 (0x0)");
    expect(formatBitmaskLabel(5n)).toBe("5 (0x5)");
    expect(formatBitmaskLabel(4n)).toBe("4 (0x4)");
  });

  it("keeps a large sequence as the original decimal string", () => {
    const sequence = "17200000000000000001";

    expect(formatSequence(sequence)).toBe("17200000000000000001");
    expect(formatSequence(sequence)).not.toBe(String(Number(sequence)));
  });

  it("names the selected network", () => {
    expect(formatNetworkName("testnet")).toBe("Testnet");
    expect(formatNetworkName("mainnet")).toBe("Mainnet");
  });
});
