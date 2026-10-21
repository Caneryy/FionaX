import { toToolError } from "@/app/tools/account-data-entries/lib/accountDataEntries.errors";
import { fetchDataEntries, type FetchDataEntriesOptions } from "@/app/tools/account-data-entries/lib/data-entries";
import { validateAccountDataEntriesInput } from "@/app/tools/account-data-entries/schema";
import type { AccountDataEntriesOutcome } from "@/app/tools/account-data-entries/types";

/** Validate, then read the account, then decode every data entry. */
export async function runAccountDataEntries(raw: string, options: FetchDataEntriesOptions): Promise<AccountDataEntriesOutcome> {
  const parsed = validateAccountDataEntriesInput(raw);

  if (!parsed.ok) {
    return parsed;
  }

  try {
    const entries = await fetchDataEntries(parsed.input.accountId, options);

    return {
      ok: true,
      result: {
        accountId: parsed.input.accountId,
        network: options.network,
        entries
      }
    };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
