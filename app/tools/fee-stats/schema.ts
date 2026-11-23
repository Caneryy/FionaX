import type { StellarNetwork } from "@/lib/stellar/horizon";
import type { FeeStatsError, FeeStatsInput } from "./types";

const NETWORKS = new Set<StellarNetwork>(["testnet", "mainnet"]);

export function validateFeeStatsInput(
  network: string
): { ok: true; input: FeeStatsInput } | { ok: false; error: FeeStatsError } {
  const trimmed = network.trim().toLowerCase();
  if (!NETWORKS.has(trimmed as StellarNetwork)) {
    return { ok: false, error: { code: "invalid_network" } };
  }
  return { ok: true, input: { network: trimmed as StellarNetwork } };
}
