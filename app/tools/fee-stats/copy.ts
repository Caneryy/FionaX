import type { FeeStatsErrorCode } from "./types";

export const copy = {
  title: "Network Fee Stats",
  description: "Show the last closed ledger's base fee, charged-fee percentiles and capacity usage from Horizon.",
  character: "A fee clerk reads the last ledger so you can pick a sensible max fee.",
  manifestCharacter: "A fee clerk posts the last ledger's charged-fee percentiles.",
  intro:
    "Refresh to load Horizon fee stats for the selected network. Every value is a historical observation from the last closed ledger — not a guarantee for your next transaction.",
  idle: "Refresh to load the network's current fee percentiles and ledger capacity usage.",
  loading: "Loading fee stats…",
  submit: "Refresh fee stats",
  refresh: "Refresh again",
  errorTitle: "Could not load fee stats",
  resultTitle: "Fee stats for the last closed ledger",
  historicalNotice:
    "These figures describe fees already charged in recent ledgers. They are observations, not a live quote or a guaranteed future fee.",
  baseFeeLabel: "Last ledger base fee",
  baseFeeHelp: "Base fee (stroops) recorded on the last closed ledger.",
  lastLedgerLabel: "Last ledger",
  capacityLabel: "Ledger capacity usage",
  capacityHelp: "Average capacity usage over the last five ledgers (0% unused → 100% full).",
  percentilesTitle: "Fee charged percentiles",
  percentilesHelp: "Per-operation fee charged (stroops) across recent ledgers, by percentile.",
  incompleteTitle: "Incomplete fee_stats response",
  incompleteBody:
    "Horizon returned fee stats with missing percentile fields. Shown values are still historical observations — treat gaps as unknown, not zero.",
  lastUpdatedLabel: "Last updated",
  stroopsSuffix: "stroops",
  percentSuffix: "%",
  errors: {
    invalid_network: "Select testnet or mainnet before loading fee stats.",
    history_unavailable:
      "Horizon has no fee stats history for this network right now. Switch network or try again later.",
    malformed_response:
      "Horizon returned a malformed fee_stats payload. Wait a moment and refresh — do not invent missing percentiles.",
    rate_limited: "Horizon is rate limiting requests. Wait a moment and refresh fee stats.",
    request_failed: "Could not load fee stats from Horizon. Check the selected network and try again."
  } satisfies Record<FeeStatsErrorCode, string>
} as const;
