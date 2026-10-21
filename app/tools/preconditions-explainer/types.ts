export type ErrorCode = "empty_xdr" | "invalid_xdr" | "unsupported_envelope" | "too_large";

export interface PreconditionsExplainerError {
  code: ErrorCode;
  message: string;
}

export interface PreconditionsExplainerInput {
  envelope: string;
}

export interface TimeBoundsInfo {
  minTime: string;
  maxTime: string;
}

export interface LedgerBoundsInfo {
  minLedger: number;
  maxLedger: number;
}

export type ExtraSignerKind = "ed25519" | "preAuthTx" | "hashX" | "ed25519SignedPayload";

export interface ExtraSignerInfo {
  kind: ExtraSignerKind;
  display: string;
}

export interface PreconditionsExplainerResult {
  unrestricted: boolean;
  timeBounds: TimeBoundsInfo | null;
  ledgerBounds: LedgerBoundsInfo | null;
  minSequenceNumber: string | null;
  minSequenceAge: string | null;
  minSequenceLedgerGap: number | null;
  extraSigners: ExtraSignerInfo[];
}
