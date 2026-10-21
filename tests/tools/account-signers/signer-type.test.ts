import { describe, expect, it } from "vitest";
import { classifySignerType } from "@/app/tools/account-signers/lib/signer-type";

describe("classifySignerType", () => {
  it("keeps hash and pre-auth types without treating them as addresses", () => {
    expect(classifySignerType("sha256_hash")).toBe("sha256_hash");
    expect(classifySignerType("preauth_tx")).toBe("preauth_tx");
    expect(classifySignerType("ed25519_public_key")).toBe("ed25519_public_key");
  });

  it("rejects an unknown type", () => {
    expect(classifySignerType("contract")).toBeNull();
  });
});
