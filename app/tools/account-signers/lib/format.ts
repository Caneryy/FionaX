import { copy } from "@/app/tools/account-signers/copy";
import type { SignerKind, Thresholds } from "@/app/tools/account-signers/types";
import type { StellarNetwork } from "@/lib/stellar/horizon";

export function formatNetworkName(network: StellarNetwork): string {
  return copy.networkNames[network];
}

export function formatWeight(weight: number): string {
  return String(weight);
}

export function formatSignerKind(kind: SignerKind): string {
  return copy.kinds[kind];
}

export function formatThreshold(thresholds: Thresholds, level: keyof Thresholds): string {
  return String(thresholds[level]);
}
