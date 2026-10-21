import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import type { ReserveCalculatorDeps } from "@/app/tools/reserve-calculator/lib/reserveCalculator";

export const simpleAccountId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 1)).publicKey();
export const baseReserveStroops = 5_000_000; // 0.5 XLM, the long-standing network default

/** A plain account: no trustlines, offers, data entries or extra signers. */
export const simpleAccountDeps: ReserveCalculatorDeps = {
  async loadAccount() {
    return {
      subentry_count: 0,
      num_sponsoring: 0,
      num_sponsored: 0,
      data_attr: {},
      signers: [{ key: simpleAccountId }],
      balances: [{ asset_type: "native", balance: "100.0000000" }]
    };
  },
  async loadBaseReserveStroops() {
    return baseReserveStroops;
  }
};
