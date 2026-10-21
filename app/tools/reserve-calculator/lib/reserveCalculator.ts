import { getHorizonServer, STELLAR_NETWORK } from "@/lib/stellar/horizon";
import { countSubentries } from "@/app/tools/reserve-calculator/lib/subentry-count";
import { minimumBalanceStroops } from "@/app/tools/reserve-calculator/lib/reserve-formula";
import { availableBalance, spendableBalance } from "@/app/tools/reserve-calculator/lib/spendable-balance";
import type { ReserveCalculatorInput, ReserveCalculatorResult } from "@/app/tools/reserve-calculator/types";

const SCALE = BigInt(10_000_000);

function toStroops(amount: string): bigint {
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole || "0") * SCALE + BigInt((fraction + "0000000").slice(0, 7));
}

/**
 * Raw fields Horizon returns on the account resource that the SDK's own
 * `AccountResponse` class does not declare a TypeScript type for, even
 * though it copies every JSON field onto the instance at runtime.
 */
interface RawAccountFields {
  subentry_count: number;
  num_sponsoring: number;
  num_sponsored: number;
  data_attr: Record<string, string>;
  signers: Array<{ key: string }>;
  balances: Array<{
    asset_type: string;
    balance: string;
    selling_liabilities?: string;
  }>;
}

interface RawLedgerFields {
  base_reserve_in_stroops: number;
}

export interface ReserveCalculatorDeps {
  loadAccount: (accountId: string) => Promise<RawAccountFields>;
  loadBaseReserveStroops: () => Promise<number>;
}

/**
 * Default dependencies, backed by the shared Horizon client. Tests inject
 * their own fixture-returning functions instead — there is no mocking
 * library in this project, so dependency injection is the mock seam.
 */
const defaultDeps: ReserveCalculatorDeps = {
  async loadAccount(accountId) {
    const server = getHorizonServer(STELLAR_NETWORK);
    const account = await server.loadAccount(accountId);
    return account as unknown as RawAccountFields;
  },
  async loadBaseReserveStroops() {
    const server = getHorizonServer(STELLAR_NETWORK);
    const ledgers = await server.ledgers().order("desc").limit(1).call();
    const latest = ledgers.records[0] as unknown as RawLedgerFields;
    return latest.base_reserve_in_stroops;
  }
};

export async function runReserveCalculator(
  input: ReserveCalculatorInput,
  deps: ReserveCalculatorDeps = defaultDeps
): Promise<ReserveCalculatorResult> {
  const [raw, baseReserveValue] = await Promise.all([deps.loadAccount(input.accountId), deps.loadBaseReserveStroops()]);
  const baseReserveStroops = BigInt(baseReserveValue);

  const subentries = countSubentries({
    accountId: input.accountId,
    subentryCount: raw.subentry_count,
    balanceCount: raw.balances.filter((balance) => balance.asset_type !== "native").length,
    dataEntryCount: Object.keys(raw.data_attr ?? {}).length,
    signerCount: raw.signers.length
  });

  const { minBalanceStroops, sponsorship } = minimumBalanceStroops(
    subentries,
    raw.num_sponsoring ?? 0,
    raw.num_sponsored ?? 0,
    baseReserveStroops
  );

  const nativeBalance = raw.balances.find((balance) => balance.asset_type === "native");
  const balanceStroops = toStroops(nativeBalance?.balance ?? "0");
  const sellingLiabilitiesStroops = toStroops(nativeBalance?.selling_liabilities ?? "0");

  const available = availableBalance(balanceStroops, minBalanceStroops);
  const spendable = spendableBalance(available, sellingLiabilitiesStroops);

  return {
    accountId: input.accountId,
    baseReserveStroops: baseReserveStroops.toString(),
    subentries,
    sponsorship,
    minBalanceStroops: minBalanceStroops.toString(),
    balanceStroops: balanceStroops.toString(),
    availableBalanceStroops: available.toString(),
    sellingLiabilitiesStroops: sellingLiabilitiesStroops.toString(),
    spendableBalanceStroops: spendable.toString()
  };
}
