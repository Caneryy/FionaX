import { Account, Asset, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

const sourceKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 3));
const sourceAccountId = sourceKeypair.publicKey();
const destinationKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 4));
const extraSignerKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 5));

export const minSeqNum = "41";
export const minSeqAge = 3_600;
export const minSeqLedgerGap = 10;
export const extraSignerAddress = extraSignerKeypair.publicKey();

export const envelopeWithSequenceConditions = (() => {
  const account = new Account(sourceAccountId, "40");
  const tx = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.payment({ destination: destinationKeypair.publicKey(), asset: Asset.native(), amount: "1" }))
    .setMinAccountSequence(minSeqNum)
    .setMinAccountSequenceAge(minSeqAge)
    .setMinAccountSequenceLedgerGap(minSeqLedgerGap)
    .setExtraSigners([extraSignerAddress])
    .setTimeout(0)
    .build();
  return tx.toXDR();
})();
