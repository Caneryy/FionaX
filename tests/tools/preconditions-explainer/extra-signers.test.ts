import { describe, expect, it } from "vitest";
import { xdr, Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import { decodeExtraSigners } from "@/app/tools/preconditions-explainer/lib/extra-signers";

const keypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 10));

describe("decodeExtraSigners", () => {
  it("decodes an ed25519 signer", () => {
    const signer = xdr.SignerKey.signerKeyTypeEd25519(keypair.rawPublicKey());
    const result = decodeExtraSigners([signer]);
    expect(result).toEqual([{ kind: "ed25519", display: keypair.publicKey() }]);
  });

  it("decodes a preAuthTx signer", () => {
    const hash = Buffer.alloc(32, 11);
    const signer = xdr.SignerKey.signerKeyTypePreAuthTx(hash);
    const result = decodeExtraSigners([signer]);
    expect(result[0].kind).toBe("preAuthTx");
    expect(result[0].display.startsWith("T")).toBe(true);
  });

  it("decodes a hashX signer", () => {
    const hash = Buffer.alloc(32, 12);
    const signer = xdr.SignerKey.signerKeyTypeHashX(hash);
    const result = decodeExtraSigners([signer]);
    expect(result[0].kind).toBe("hashX");
    expect(result[0].display.startsWith("X")).toBe(true);
  });

  it("returns an empty list for no signers", () => {
    expect(decodeExtraSigners([])).toEqual([]);
  });
});
