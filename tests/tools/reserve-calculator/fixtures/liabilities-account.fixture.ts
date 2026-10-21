import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import type { ReserveCalculatorDeps } from "@/app/tools/reserve-calculator/lib/reserveCalculator";
import { baseReserveStroops } from "@/tests/tools/reserve-calculator/fixtures/simple-account.fixture";

export const liabilitiesAccountId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 3)).publicKey();

/** An account with XLM committed to open sell offers (selling_liabilities). */
export const liabilitiesAccountDeps: ReserveCalculatorDeps = {
  async loadAccount() {
    return {
      subentry_count: 1,
      num_sponsoring: 0,
      num_sponsored: 0,
      data_attr: {},
      signers: [{ key: liabilitiesAccountId }],
      balances: [{ asset_type: "native", balance: "100.0000000", selling_liabilities: "20.0000000" }]
    };
  },
  async loadBaseReserveStroops() {
    return baseReserveStroops;
  }
};
