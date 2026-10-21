import { copy } from "@/app/tools/asset-flags-inspector/copy";
import type { StellarNetwork } from "@/lib/stellar/horizon";

export function formatFlagState(enabled: boolean): string {
  return enabled ? copy.flagState.on : copy.flagState.off;
}

export function formatBitmaskDecimal(bitmask: bigint): string {
  return bitmask.toString(10);
}

export function formatBitmaskHex(bitmask: bigint): string {
  return `0x${bitmask.toString(16)}`;
}

/** Decimal and hex, side by side, so a developer can check the protocol mask. */
export function formatBitmaskLabel(bitmask: bigint): string {
  return `${formatBitmaskDecimal(bitmask)} (${formatBitmaskHex(bitmask)})`;
}

/** Sequence is already a decimal string from Horizon. Do not pass it through Number. */
export function formatSequence(sequence: string): string {
  return sequence;
}

export function formatNetworkName(network: StellarNetwork): string {
  return copy.networkNames[network];
}
