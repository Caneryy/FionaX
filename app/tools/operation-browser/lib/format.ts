import type { StellarNetwork } from "@/lib/stellar/horizon";
import { copy } from "../copy";

const explorerBaseUrls: Record<StellarNetwork, string> = {
  testnet: "https://stellar.expert/explorer/testnet/tx",
  mainnet: "https://stellar.expert/explorer/public/tx"
};

export function formatOperationTime(value: string | null): string {
  if (!value || Number.isNaN(Date.parse(value))) return copy.timeUnavailable;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium", timeStyle: "short", timeZone: "UTC"
  }).format(new Date(value)) + " UTC";
}

export function shortAccountId(value: string): string {
  return `${value.slice(0, 6)}…${value.slice(-6)}`;
}

export function transactionExplorerUrl(network: StellarNetwork, hash: string): string {
  return `${explorerBaseUrls[network]}/${hash}`;
}
