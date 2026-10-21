import { Account, Asset, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

const sourceKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 1));
const sourceAccountId = sourceKeypair.publicKey();
const destinationKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 2));

export const minTime = 1_700_000_000;
export const maxTime = 1_700_086_400;

export const envelopeWithTimeBounds = (() => {
  const account = new Account(sourceAccountId, "1");
  const tx = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.payment({ destination: destinationKeypair.publicKey(), asset: Asset.native(), amount: "1" }))
    .setTimebounds(minTime, maxTime)
    .build();
  return tx.toXDR();
})();
