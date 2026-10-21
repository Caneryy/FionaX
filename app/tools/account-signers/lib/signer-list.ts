import { classifySignerType } from "@/app/tools/account-signers/lib/signer-type";
import { readThresholds } from "@/app/tools/account-signers/lib/threshold-fields";
import { isRejectedSecret } from "@/app/tools/account-signers/schema";
import type { AccountSignersErrorCode, SignerView, Thresholds } from "@/app/tools/account-signers/types";
import { horizonUrls, type StellarNetwork } from "@/lib/stellar/horizon";

export class SecretSeedRejectedError extends Error {
  readonly code = "invalid_account" as const;

  constructor() {
    super("invalid_account");
    this.name = "SecretSeedRejectedError";
  }
}

export class SignersFailure extends Error {
  readonly code: Exclude<AccountSignersErrorCode, "invalid_account">;

  constructor(code: Exclude<AccountSignersErrorCode, "invalid_account">) {
    super(code);
    this.name = "SignersFailure";
    this.code = code;
  }
}

export interface FetchSignersOptions {
  network: StellarNetwork;
  fetchImpl?: typeof fetch;
}

export interface SignerSnapshot {
  signers: SignerView[];
  thresholds: Thresholds;
  masterWeightZero: boolean;
}

export function horizonAccountUrl(network: StellarNetwork, accountId: string): string {
  const base = horizonUrls[network].replace(/\/$/, "");
  return `${base}/accounts/${encodeURIComponent(accountId)}`;
}

export function parseSigners(body: unknown, expectedAccountId: string): SignerSnapshot {
  if (!body || typeof body !== "object") {
    throw new SignersFailure("request_failed");
  }

  const record = body as Record<string, unknown>;

  if (record.account_id !== expectedAccountId || !Array.isArray(record.signers)) {
    throw new SignersFailure("request_failed");
  }

  const thresholds = readThresholds(record.thresholds);

  if (!thresholds) {
    throw new SignersFailure("request_failed");
  }

  const signers: SignerView[] = record.signers.map((entry) => {
    if (!entry || typeof entry !== "object") {
      throw new SignersFailure("malformed_signer");
    }

    const signer = entry as Record<string, unknown>;
    const kind = typeof signer.type === "string" ? classifySignerType(signer.type) : null;

    if (typeof signer.key !== "string" || signer.key.length === 0 || typeof signer.weight !== "number" || !Number.isInteger(signer.weight) || !kind) {
      throw new SignersFailure("malformed_signer");
    }

    return {
      key: signer.key,
      weight: signer.weight,
      kind,
      master: signer.key === expectedAccountId
    };
  });

  return {
    signers,
    thresholds,
    masterWeightZero: signers.some((signer) => signer.master && signer.weight === 0)
  };
}

export async function fetchSigners(accountId: string, options: FetchSignersOptions): Promise<SignerSnapshot> {
  if (isRejectedSecret(accountId)) {
    throw new SecretSeedRejectedError();
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  let response: Response;

  try {
    response = await fetchImpl(horizonAccountUrl(options.network, accountId), {
      method: "GET",
      headers: { Accept: "application/json" }
    });
  } catch {
    throw new SignersFailure("request_failed");
  }

  if (response.status === 404) throw new SignersFailure("account_not_found");
  if (response.status === 429) throw new SignersFailure("rate_limited");
  if (!response.ok) throw new SignersFailure("request_failed");

  try {
    return parseSigners(await response.json(), accountId);
  } catch (error) {
    if (error instanceof SignersFailure) throw error;
    throw new SignersFailure("request_failed");
  }
}
