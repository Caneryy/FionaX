import type { ErrorCode } from "@/app/tools/result-code-explainer/types";

export const copy = {
  title: "Result Code Explainer",
  idle: "Enter a Horizon or protocol result code to see what it means and its most common causes.",
  loading: "Looking it up…",
  empty: "This is a local, offline lookup table — nothing is sent anywhere.",
  codePlaceholder: "e.g. tx_bad_seq, underfunded, no_trust",
  operationTypePlaceholder: "Operation type (only needed for an ambiguous code)",
  submit: "Explain code",
  resultTitle: "Explanation",
  commonCausesTitle: "Common causes",
  noCommonCauses: "This code has no common failure causes to list.",
  errors: {
    empty_code: "Enter a result code first.",
    unknown_code: "That code is not in this tool's table. It may be unrecognized, not misspelled — this tool never guesses.",
    ambiguous_operation_type: "This code means something different per operation type. Pick the operation type and try again."
  } satisfies Record<ErrorCode, string>
};
