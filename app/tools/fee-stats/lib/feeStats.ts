import type { FeeStatsInput, ToolOutcome } from "../types";
import { capacityUsagePercent } from "./capacity-usage";
import { fetchFeeStats } from "./fee-stats-fetch";
import { toToolError } from "./feeStats.errors";
import { normalizePercentileRows } from "./percentile-rows";
import { validateFeeStatsInput } from "../schema";

export interface RunFeeStatsOptions {
  fetchImpl?: typeof fetch;
  now?: () => Date;
}

/**
 * Validate network, fetch Horizon /fee_stats, and assemble a result.
 * Incomplete percentile sets stay in the success path with `incomplete: true`.
 */
export async function runFeeStats(
  input: FeeStatsInput,
  options: RunFeeStatsOptions = {}
): Promise<ToolOutcome> {
  const parsed = validateFeeStatsInput(input.network);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  try {
    const raw = await fetchFeeStats(parsed.input, options.fetchImpl ?? fetch);
    const percentiles = normalizePercentileRows(raw.fee_charged);
    let percent: string;
    try {
      percent = capacityUsagePercent(raw.ledger_capacity_usage);
    } catch {
      return { ok: false, error: { code: "malformed_response" } };
    }

    const fetchedAt = (options.now ?? (() => new Date()))().toISOString();

    return {
      ok: true,
      result: {
        lastLedger: raw.last_ledger,
        lastLedgerBaseFee: raw.last_ledger_base_fee,
        capacityUsageRatio: raw.ledger_capacity_usage,
        capacityUsagePercent: percent,
        percentiles: percentiles.rows,
        incomplete: percentiles.incomplete,
        fetchedAt,
        network: parsed.input.network
      }
    };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
