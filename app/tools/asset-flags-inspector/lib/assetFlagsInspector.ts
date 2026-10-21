import { toToolError } from "@/app/tools/asset-flags-inspector/lib/assetFlagsInspector.errors";
import { explainIssuerFlags } from "@/app/tools/asset-flags-inspector/lib/flag-explanations";
import { computeFlagBitmask } from "@/app/tools/asset-flags-inspector/lib/flag-bitmask";
import { fetchIssuerFlags, type FetchIssuerFlagsOptions } from "@/app/tools/asset-flags-inspector/lib/issuer-flags";
import { validateAssetFlagsInspectorInput } from "@/app/tools/asset-flags-inspector/schema";
import type { AssetFlagsInspectorOutcome } from "@/app/tools/asset-flags-inspector/types";

/**
 * Validate, then read the issuer account, then explain the flags.
 * Validation failures and Horizon failures both come back as a result, not a throw.
 */
export async function runAssetFlagsInspector(raw: string, options: FetchIssuerFlagsOptions): Promise<AssetFlagsInspectorOutcome> {
  const parsed = validateAssetFlagsInspectorInput(raw);

  if (!parsed.ok) {
    return parsed;
  }

  try {
    const snapshot = await fetchIssuerFlags(parsed.input.accountId, options);
    const flags = snapshot.flags;

    return {
      ok: true,
      result: {
        accountId: snapshot.accountId,
        network: options.network,
        sequence: snapshot.sequence,
        flags,
        bitmask: computeFlagBitmask(flags),
        explanation: explainIssuerFlags(flags)
      }
    };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
