import { horizonUrls } from "@/lib/stellar/horizon";
import type { FeeStatsInput, RawFeeStatsResponse } from "../types";
import { ToolFailure } from "./feeStats.errors";

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ToolFailure("malformed_response");
  }
  return value as Record<string, unknown>;
}

function asPositiveIntString(value: unknown, field: string): string {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) {
    return String(value);
  }
  if (typeof value === "string" && /^(0|[1-9][0-9]*)$/.test(value.trim())) {
    return value.trim();
  }
  void field;
  throw new ToolFailure("malformed_response");
}

function asNonNegativeIntString(value: unknown): string {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) {
    return String(value);
  }
  if (typeof value === "string" && /^(0|[1-9][0-9]*)$/.test(value.trim())) {
    return value.trim();
  }
  throw new ToolFailure("malformed_response");
}

function asCapacityRatio(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1) {
    // Preserve a stable decimal string without float noise for common cases.
    return String(value);
  }
  if (typeof value === "string" && /^(0|1)(\.[0-9]+)?$/.test(value.trim())) {
    const trimmed = value.trim();
    const [whole, fraction = ""] = trimmed.split(".");
    if (whole === "1" && /[1-9]/.test(fraction)) {
      throw new ToolFailure("malformed_response");
    }
    return trimmed;
  }
  throw new ToolFailure("malformed_response");
}

function asFeeCharged(value: unknown): Record<string, string> {
  const obj = asObject(value);
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(obj)) {
    if (typeof raw === "number" && Number.isSafeInteger(raw) && raw >= 0) {
      out[key] = String(raw);
      continue;
    }
    if (typeof raw === "string" && /^(0|[1-9][0-9]*)$/.test(raw.trim())) {
      out[key] = raw.trim();
      continue;
    }
    // Skip non-integer percentile fields — incomplete handling lives upstream.
  }
  return out;
}

/**
 * Decode a Horizon fee_stats JSON body into the tool's raw shape.
 * Throws ToolFailure("malformed_response") when required top-level fields are unusable.
 */
export function decodeFeeStatsResponse(body: unknown): RawFeeStatsResponse {
  const root = asObject(body);
  return {
    last_ledger: asPositiveIntString(root.last_ledger, "last_ledger"),
    last_ledger_base_fee: asNonNegativeIntString(root.last_ledger_base_fee),
    ledger_capacity_usage: asCapacityRatio(root.ledger_capacity_usage),
    fee_charged: asFeeCharged(root.fee_charged)
  };
}

/**
 * Fetch the current fee_stats response from Horizon for the selected network.
 */
export async function fetchFeeStats(
  input: FeeStatsInput,
  fetchImpl: typeof fetch = fetch
): Promise<RawFeeStatsResponse> {
  const url = new URL("/fee_stats", horizonUrls[input.network]);
  let response: Response;
  try {
    response = await fetchImpl(url.toString(), {
      headers: { Accept: "application/json" }
    });
  } catch {
    throw new ToolFailure("request_failed");
  }

  if (response.status === 404) throw new ToolFailure("history_unavailable");
  if (response.status === 429) throw new ToolFailure("rate_limited");
  if (!response.ok) throw new ToolFailure("request_failed");

  try {
    return decodeFeeStatsResponse(await response.json());
  } catch (error) {
    if (error instanceof ToolFailure) throw error;
    throw new ToolFailure("malformed_response");
  }
}
