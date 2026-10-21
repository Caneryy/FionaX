import { MAX_BATCH_ENTRIES } from "@/app/tools/batch-address-validator/lib/limits";

export const copy = {
  title: "Batch Address Validator",
  characterEyebrow: "Star clerk",
  idle:
    "The star clerk checks a whole stack of public key badges in this browser and turns away any secret seed before it can be written down.",
  formLabel: "Address list",
  formHint: `Paste up to ${MAX_BATCH_ENTRIES} Stellar public addresses, one per line or separated by commas. Never paste a secret seed.`,
  placeholder: "G...\nG...",
  submit: "Validate addresses",
  submitting: "Checking locally...",
  emptyTitle: "No list checked yet",
  emptyDescription:
    "Paste public addresses separated by new lines or commas. The check stays in this browser. Leave secret seeds out of the list.",
  emptySubmittedTitle: "This list is empty",
  processingTitle: "Checking this list locally",
  processingDescription: "Each entry is validated in the browser. Nothing is sent to a network.",
  resultTitle: "Validation finished",
  summaryTitle: "Batch summary",
  rowsTitle: "Entries in input order",
  errorTitle: "This list needs a change",
  duplicateNoticeTitle: "Duplicate addresses",
  secretWarningTitle: "Secret seed rejected",
  status: {
    valid: "Valid",
    invalid: "Invalid",
    duplicate: "Duplicate"
  },
  errors: {
    empty_batch: "Paste at least one Stellar public address. Spaces, commas, and blank lines alone are not a list.",
    too_many_entries: `This list has more than ${MAX_BATCH_ENTRIES} addresses. Split it into smaller lists of ${MAX_BATCH_ENTRIES} or fewer and validate each one.`,
    contains_secret_seed:
      "This list contains a secret seed. The batch was rejected. Secret seeds are never shown or stored. Remove the seed and paste public addresses only.",
    invalid_address: "This entry is not a valid Stellar public address. Public addresses start with G and pass the StrKey checksum.",
    duplicate_address: "This public address is already in the list. The first copy stays valid and later copies are marked as duplicates."
  }
} as const;
