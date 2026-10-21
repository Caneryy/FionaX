export type ErrorCode = "invalid_account" | "account_not_found" | "rate_limited" | "request_failed";

export interface ReserveCalculatorError {
  code: ErrorCode;
  message: string;
}

export interface ReserveCalculatorInput {
  accountId: string;
}

export interface SubentryBreakdown {
  trustlines: number;
  offers: number;
  dataEntries: number;
  extraSigners: number;
  total: number;
}

export interface SponsorshipAdjustment {
  numSponsoring: number;
  numSponsored: number;
  /** (numSponsoring - numSponsored) * baseReserve, in stroops. Can be negative. */
  netReserveStroops: string;
}

export interface ReserveCalculatorResult {
  accountId: string;
  baseReserveStroops: string;
  subentries: SubentryBreakdown;
  sponsorship: SponsorshipAdjustment;
  minBalanceStroops: string;
  balanceStroops: string;
  availableBalanceStroops: string;
  sellingLiabilitiesStroops: string;
  spendableBalanceStroops: string;
}
