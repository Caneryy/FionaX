import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/account-merge-preflight/copy";
import { decimalToStroops, formatNativeBalance, formatNetworkName, formatStroops } from "@/app/tools/account-merge-preflight/lib/format";

describe("merge preflight formatting", () => {
  it("keeps a 7-digit balance exact in stroops", () => {
    expect(decimalToStroops("10.0000000")).toBe(100000000n);
    expect(decimalToStroops("0.0000001")).toBe(1n);
    expect(formatNativeBalance("10.0000000")).toBe("10.0000000 XLM");
    expect(formatStroops(100000000n)).toBe("100000000 stroops");
  });

  it("rejects a float-looking value with too many decimals", () => {
    expect(decimalToStroops("1.00000001")).toBeNull();
  });

  it("uses the network labels from copy", () => {
    expect(formatNetworkName("testnet")).toBe(copy.networkNames.testnet);
    expect(formatNetworkName("mainnet")).toBe(copy.networkNames.mainnet);
  });
});
