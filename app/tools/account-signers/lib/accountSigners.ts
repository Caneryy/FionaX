import { toToolError } from "@/app/tools/account-signers/lib/accountSigners.errors";
import { fetchSigners, type FetchSignersOptions } from "@/app/tools/account-signers/lib/signer-list";
import { validateAccountSignersInput } from "@/app/tools/account-signers/schema";
import type { AccountSignersOutcome } from "@/app/tools/account-signers/types";

export async function runAccountSigners(raw: string, options: FetchSignersOptions): Promise<AccountSignersOutcome> {
  const parsed = validateAccountSignersInput(raw);

  if (!parsed.ok) return parsed;

  try {
    const snapshot = await fetchSigners(parsed.input.accountId, options);

    return {
      ok: true,
      result: {
        accountId: parsed.input.accountId,
        network: options.network,
        signers: snapshot.signers,
        thresholds: snapshot.thresholds,
        masterWeightZero: snapshot.masterWeightZero
      }
    };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
