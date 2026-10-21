import { horizonAccountUrl, MergeFailure, type FetchOptions } from "@/app/tools/account-merge-preflight/lib/source-snapshot";
import { isRejectedSecret } from "@/app/tools/account-merge-preflight/schema";

/** Confirm the destination account exists. A 404 is destination_not_found, not a bad id. */
export async function destinationExists(accountId: string, options: FetchOptions): Promise<boolean> {
  if (isRejectedSecret(accountId)) {
    throw new MergeFailure("request_failed");
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  let response: Response;

  try {
    response = await fetchImpl(horizonAccountUrl(options.network, accountId), {
      method: "GET",
      headers: { Accept: "application/json" }
    });
  } catch {
    throw new MergeFailure("request_failed");
  }

  if (response.status === 404) {
    throw new MergeFailure("destination_not_found");
  }

  if (response.status === 429) {
    throw new MergeFailure("rate_limited");
  }

  if (!response.ok) {
    throw new MergeFailure("request_failed");
  }

  return true;
}
