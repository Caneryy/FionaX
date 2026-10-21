import { describe, expect, it } from "vitest";
import { detectXdr } from "@/app/tools/xdr-inspector/lib/xdr-detect";
import { decodeXdr } from "@/app/tools/xdr-inspector/lib/xdr-decode";
import { ledgerXdr } from "./fixtures/ledger-xdr.fixture";

describe("XDR decoding", () => {
  it("renders the complete nested TTL ledger entry", () => {
    const detected = detectXdr(ledgerXdr);
    expect(detected).not.toBeNull();
    const json = JSON.parse(decodeXdr(detected!));
    expect(json.lastModifiedLedgerSeq).toBe(12);
    expect(json.data.switch).toBe("ttl");
    expect(json.data.ttl.liveUntilLedgerSeq).toBe(34);
    expect(json.data.ttl.keyHash).toBe("02".repeat(32));
  });
});
