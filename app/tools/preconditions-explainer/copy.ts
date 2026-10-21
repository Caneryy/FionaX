import type { ErrorCode } from "@/app/tools/preconditions-explainer/types";

export const copy = {
  title: "Transaction Preconditions Explainer",
  idle: "Paste a transaction envelope to see what has to be true before it can be submitted.",
  loading: "Decoding…",
  empty: "This tool is fully offline — nothing is sent anywhere.",
  submit: "Explain preconditions",
  placeholder: "Paste a base64 transaction envelope",
  unrestrictedTitle: "Unrestricted",
  unrestrictedDescription: "This envelope has no preconditions at all — it is eligible to be submitted at any time, subject only to normal validation.",
  timeBoundsTitle: "Time bounds",
  ledgerBoundsTitle: "Ledger bounds",
  sequenceTitle: "Sequence-number conditions",
  extraSignersTitle: "Required extra signers",
  minSeqNumLabel: "Minimum sequence number",
  minSeqAgeLabel: "Minimum sequence age",
  minSeqLedgerGapLabel: "Minimum sequence ledger gap",
  errors: {
    empty_xdr: "Enter a transaction envelope first.",
    invalid_xdr: "That is not valid base64 XDR for a transaction envelope.",
    unsupported_envelope: "This envelope shape is not supported.",
    too_large: "That envelope is larger than this tool accepts."
  } satisfies Record<ErrorCode, string>
};
