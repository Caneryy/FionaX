import { toToolError } from "@/app/tools/account-merge-preflight/lib/accountMergePreflight.errors";
import { destinationExists } from "@/app/tools/account-merge-preflight/lib/destination-check";
import { collectMergeBlockers } from "@/app/tools/account-merge-preflight/lib/merge-blockers";
import { fetchSourceSnapshot, MergeFailure, type FetchOptions } from "@/app/tools/account-merge-preflight/lib/source-snapshot";
import { validateAccountMergePreflightInput } from "@/app/tools/account-merge-preflight/schema";
import type { AccountMergePreflightOutcome } from "@/app/tools/account-merge-preflight/types";

export async function runAccountMergePreflight(
  sourceRaw: string,
  destinationRaw: string,
  options: FetchOptions
): Promise<AccountMergePreflightOutcome> {
  const parsed = validateAccountMergePreflightInput(sourceRaw, destinationRaw);

  if (!parsed.ok) {
    return parsed;
  }

  try {
    const snapshot = await fetchSourceSnapshot(parsed.input.sourceId, options);
    let found = true;

    try {
      found = await destinationExists(parsed.input.destinationId, options);
    } catch (error) {
      if (error instanceof MergeFailure && error.code === "destination_not_found") {
        found = false;
      } else {
        throw error;
      }
    }

    const blockers = collectMergeBlockers(snapshot, found);

    return {
      ok: true,
      result: {
        sourceId: parsed.input.sourceId,
        destinationId: parsed.input.destinationId,
        network: options.network,
        nativeBalance: snapshot.nativeBalance,
        nativeStroops: snapshot.nativeStroops,
        destinationExists: found,
        mergeable: blockers.length === 0,
        blockers
      }
    };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
