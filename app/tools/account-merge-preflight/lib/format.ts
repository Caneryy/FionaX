import { copy } from "@/app/tools/account-merge-preflight/copy";
import type { StellarNetwork } from "@/lib/stellar/horizon";

export function formatNetworkName(network: StellarNetwork): string {
  return copy.networkNames[network];
}

export function formatNativeBalance(balance: string): string {
  return `${balance} XLM`;
}

export function formatStroops(stroops: bigint): string {
  return `${stroops.toString(10)} stroops`;
}

/** Convert a Horizon decimal balance into stroops without using a float. */
export function decimalToStroops(amount: string): bigint | null {
  const match = /^(\d+)(?:\.(\d{1,7}))?$/.exec(amount);

  if (!match) {
    return null;
  }

  const fraction = (match[2] ?? "").padEnd(7, "0");
  return BigInt(`${match[1]}${fraction}`);
}
