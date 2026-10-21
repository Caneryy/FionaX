import { copy } from "@/app/tools/account-data-entries/copy";
import type { DataEntryEncoding } from "@/app/tools/account-data-entries/types";
import type { StellarNetwork } from "@/lib/stellar/horizon";

export function formatNetworkName(network: StellarNetwork): string {
  return copy.networkNames[network];
}

export function formatByteLength(bytes: number): string {
  return `${bytes} bytes`;
}

export function formatEncoding(encoding: DataEntryEncoding): string {
  return copy.encoding[encoding];
}

export function formatEntryCount(count: number): string {
  return String(count);
}

export function formatDecodedValue(encoding: DataEntryEncoding, text: string | null, hex: string): string {
  if (encoding === "text" && text !== null) {
    return text;
  }

  return hex;
}
