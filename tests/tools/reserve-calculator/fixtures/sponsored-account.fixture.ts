import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import type { ReserveCalculatorDeps } from "@/app/tools/reserve-calculator/lib/reserveCalculator";
import { baseReserveStroops } from "@/tests/tools/reserve-calculator/fixtures/simple-account.fixture";

export const sponsoredAccountId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 2)).publicKey();

/** An account that sponsors 3 entries for others and has 1 entry sponsored for it. */
export const sponsoredAccountDeps: ReserveCalculatorDeps = {
  async loadAccount() {
    return {
      subentry_count: 1,
      num_sponsoring: 3,
      num_sponsored: 1,
      data_attr: {},
      signers: [{ key: sponsoredAccountId }],
      balances: [
        { asset_type: "native", balance: "50.0000000" },
        { asset_type: "credit_alphanum4", balance: "10.0000000" }
      ]
    };
  },
  async loadBaseReserveStroops() {
    return baseReserveStroops;
  }
};
