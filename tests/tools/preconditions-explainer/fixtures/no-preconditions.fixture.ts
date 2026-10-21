import { Account, Asset, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

const sourceKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 6));
const sourceAccountId = sourceKeypair.publicKey();
const destinationKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 7));

/** A plain transaction with no preconditions at all — the "unrestricted" case. */
export const envelopeWithNoPreconditions = (() => {
  const account = new Account(sourceAccountId, "80");
  const tx = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.payment({ destination: destinationKeypair.publicKey(), asset: Asset.native(), amount: "1" }))
    .setTimeout(0)
    .build();
  return tx.toXDR();
})();

export const emptyEnvelope = "";
export const malformedEnvelope = "not-valid-base64-xdr!!";
export const oversizedEnvelope = "A".repeat(70_000);
