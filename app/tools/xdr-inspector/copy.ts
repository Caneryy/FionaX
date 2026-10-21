import type { XdrInspectorErrorCode, XdrType } from "./types";

export const copy = {
  title: "XDR Inspector",
  manifestDescription: "Decode pasted Stellar XDR locally into readable JSON.",
  manifestCharacter: "A curious comet reveals the structure inside Stellar XDR.",
  eyebrow: "Developer utility",
  intro: "Paste base64 Stellar XDR to inspect its decoded structure locally in your browser.",
  guidance: "Supports transaction envelopes, transaction results, and ledger entries. Nothing is submitted or saved.",
  inputLabel: "Base64 XDR",
  inputPlaceholder: "Paste a transaction envelope, transaction result, or ledger entry XDR blob",
  submit: "Inspect XDR",
  loading: "Decoding locally…",
  resultTitle: "Decoded XDR",
  treeLabel: "Decoded JSON structure",
  detectedLabel: "Detected type",
  sizeLabel: "Decoded size",
  bytesUnit: "bytes",
  maxSize: "256 KiB",
  sizeWarning: "This XDR exceeds the 256 KiB limit. Paste a smaller blob.",
  errorTitle: "Could not inspect XDR",
  undetectedTitle: "Could not decode as a supported XDR type",
  types: {
    transaction_envelope: "Transaction envelope",
    transaction_result: "Transaction result",
    ledger_entry: "Ledger entry"
  } satisfies Record<XdrType, string>,
  errors: {
    empty_xdr: "Paste a base64 XDR blob before inspecting.",
    invalid_xdr: "Enter a complete, valid base64 XDR blob. Check for missing or extra characters.",
    too_large: "The blob is over 256 KiB. Paste a smaller XDR blob.",
    undetected_type: "The bytes do not decode fully as a transaction envelope, transaction result, or ledger entry. Check the XDR type and content."
  } satisfies Record<XdrInspectorErrorCode, string>
};
