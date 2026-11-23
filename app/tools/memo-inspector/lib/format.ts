import { copy } from "@/app/tools/memo-inspector/copy";
import type { MemoKind } from "@/app/tools/memo-inspector/types";
import type { StellarNetwork } from "@/lib/stellar/horizon";

export function formatNetworkName(network: StellarNetwork): string {
  return copy.networkNames[network];
}

export function formatMemoKind(kind: MemoKind): string {
  return copy.kinds[kind];
}

export function formatTransactionStatus(successful: boolean): string {
  return successful ? copy.status.successful : copy.status.failed;
}

export function formatMemoId(id: string): string {
  return id;
}

export function formatHex(hex: string): string {
  return hex.toLowerCase();
}

export function formatBase64(base64: string): string {
  return base64;
}

export function formatCreatedAt(iso: string): string {
  return iso;
}
