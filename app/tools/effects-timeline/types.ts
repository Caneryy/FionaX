import type { StellarNetwork } from "@/lib/stellar/horizon";

export interface EffectsTimelineInput {
  accountId: string;
  network: StellarNetwork;
  cursor?: string;
}

export interface TimelineEffect {
  pagingToken: string;
  type: string;
  createdAt: string | null;
  details: Record<string, unknown>;
}

export interface EffectsTimelineResult {
  accountId: string;
  network: StellarNetwork;
  effects: TimelineEffect[];
  nextCursor: string | null;
}

export type EffectsTimelineErrorCode =
  | "invalid_account"
  | "account_not_found"
  | "invalid_cursor"
  | "malformed_effect"
  | "rate_limited"
  | "request_failed";

export interface EffectsTimelineError {
  code: EffectsTimelineErrorCode;
}

export type EffectsTimelineOutcome =
  | { ok: true; result: EffectsTimelineResult }
  | { ok: false; error: EffectsTimelineError };

export type EffectsTimelineState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: EffectsTimelineResult; loadingMore: boolean; pageError: EffectsTimelineError | null }
  | { status: "error"; error: EffectsTimelineError };
