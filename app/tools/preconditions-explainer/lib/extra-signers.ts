import { StrKey, xdr } from "@stellar/stellar-sdk";
import type { ExtraSignerInfo } from "@/app/tools/preconditions-explainer/types";

/** Decodes the required extra signers, if any, into a displayable form. */
export function decodeExtraSigners(signers: xdr.SignerKey[]): ExtraSignerInfo[] {
  return signers.map((signer) => {
    const name = signer.switch().name;
    switch (name) {
      case "signerKeyTypeEd25519":
        return { kind: "ed25519", display: StrKey.encodeEd25519PublicKey(Buffer.from(signer.ed25519())) };
      case "signerKeyTypePreAuthTx":
        return { kind: "preAuthTx", display: StrKey.encodePreAuthTx(Buffer.from(signer.preAuthTx())) };
      case "signerKeyTypeHashX":
        return { kind: "hashX", display: StrKey.encodeSha256Hash(Buffer.from(signer.hashX())) };
      default: {
        const payload = signer.ed25519SignedPayload();
        const signerAddress = StrKey.encodeEd25519PublicKey(Buffer.from(payload.ed25519()));
        const payloadHex = Buffer.from(payload.payload()).toString("hex");
        return { kind: "ed25519SignedPayload", display: `${signerAddress} (payload ${payloadHex.slice(0, 16)}…)` };
      }
    }
  });
}
