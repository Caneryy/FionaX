import type { CodeEntry } from "@/app/tools/result-code-explainer/types";

/**
 * The data-driven table of known result codes. Adding a new code means
 * adding a row here — no UI change is required. Codes are Horizon's own
 * snake_case spellings; operation-level codes that are shared verbatim
 * across every operation type (the `op_*` envelope) have no `operationType`,
 * while codes whose meaning depends on the operation (like `malformed` or
 * `underfunded`, which several operation types reuse with different
 * implications) carry one.
 *
 * This table is deliberately not exhaustive — see the README.
 */
export const RESULT_CODE_TABLE: CodeEntry[] = [
  // Transaction-level codes.
  {
    code: "tx_success",
    category: "transaction",
    label: "Success",
    explanation: "The transaction succeeded and every operation applied.",
    commonCauses: []
  },
  {
    code: "tx_failed",
    category: "transaction",
    label: "An operation failed",
    explanation: "One or more operations inside the transaction returned a non-success result.",
    commonCauses: ["Check each operation's own result code for the specific cause."]
  },
  {
    code: "tx_too_early",
    category: "transaction",
    label: "Submitted too early",
    explanation: "The transaction was submitted before its minTime precondition.",
    commonCauses: ["The minTime time bound has not been reached yet.", "Clock skew between the client and the network."]
  },
  {
    code: "tx_too_late",
    category: "transaction",
    label: "Submitted too late",
    explanation: "The transaction was submitted after its maxTime precondition (or default timeout deadline).",
    commonCauses: ["The maxTime time bound, or a setTimeout() deadline, has passed.", "The transaction sat too long before being submitted."]
  },
  {
    code: "tx_missing_operation",
    category: "transaction",
    label: "No operations",
    explanation: "The transaction has no operations at all.",
    commonCauses: ["The transaction was built with zero operations."]
  },
  {
    code: "tx_bad_seq",
    category: "transaction",
    label: "Wrong sequence number",
    explanation: "The sequence number does not match the source account's expected next sequence number.",
    commonCauses: [
      "The sequence number is too low (already used).",
      "The sequence number is too high (a gap).",
      "The source account's sequence number changed since the transaction was built."
    ]
  },
  {
    code: "tx_bad_auth",
    category: "transaction",
    label: "Insufficient signatures",
    explanation: "The signatures on the transaction are insufficient or invalid.",
    commonCauses: ["A required signature is missing.", "The wrong network passphrase was signed with.", "The signature weight threshold was not met."]
  },
  {
    code: "tx_insufficient_balance",
    category: "transaction",
    label: "Insufficient balance",
    explanation: "The source account's balance after the transaction would fall below its minimum reserve, or cannot cover the fee.",
    commonCauses: ["Not enough XLM to pay the fee while still meeting the minimum reserve."]
  },
  {
    code: "tx_no_account",
    category: "transaction",
    label: "Source account not found",
    explanation: "The source account does not exist on this network.",
    commonCauses: ["The account was never funded on this network.", "The wrong network is selected (testnet vs. public)."]
  },
  {
    code: "tx_insufficient_fee",
    category: "transaction",
    label: "Fee too low",
    explanation: "The fee is lower than the network's current minimum, or the fee required for this ledger.",
    commonCauses: ["The base fee is too low for current network congestion.", "A fee-bump transaction was required but not supplied."]
  },
  {
    code: "tx_bad_auth_extra",
    category: "transaction",
    label: "Extra signatures",
    explanation: "Extra signatures were provided beyond what the required signers allow.",
    commonCauses: ["Unused or unexpected additional signatures were attached."]
  },
  {
    code: "tx_internal_error",
    category: "transaction",
    label: "Internal error",
    explanation: "An unexpected error occurred inside stellar-core while applying the transaction.",
    commonCauses: ["Rare — often a network condition or a core bug. Worth reporting."]
  },
  {
    code: "tx_not_supported",
    category: "transaction",
    label: "Not supported",
    explanation: "This transaction type or feature is not supported by the current protocol version.",
    commonCauses: ["Using a newer transaction feature on an older network or protocol version."]
  },
  {
    code: "tx_fee_bump_inner_failed",
    category: "transaction",
    label: "Inner transaction failed",
    explanation: "The inner transaction wrapped by a fee-bump transaction failed.",
    commonCauses: ["Check the inner transaction's own result code for the specific cause."]
  },
  {
    code: "tx_bad_sponsorship",
    category: "transaction",
    label: "Bad sponsorship",
    explanation: "A sponsorship-related precondition was violated.",
    commonCauses: ["Mismatched begin-sponsoring and end-sponsoring operations."]
  },
  {
    code: "tx_bad_min_seq_age_or_gap",
    category: "transaction",
    label: "Sequence age or gap precondition not met",
    explanation: "The transaction's minSeqAge or minSeqLedgerGap precondition was not satisfied.",
    commonCauses: ["The source account's sequence number was bumped too recently."]
  },
  {
    code: "tx_malformed",
    category: "transaction",
    label: "Malformed envelope",
    explanation: "The transaction envelope itself is malformed.",
    commonCauses: ["Invalid XDR structure.", "A value is outside the range the protocol allows."]
  },
  {
    code: "tx_soroban_invalid",
    category: "transaction",
    label: "Invalid Soroban data",
    explanation: "The transaction's Soroban-specific data is invalid.",
    commonCauses: ["Missing or malformed SorobanTransactionData.", "Resource limits are malformed."]
  },

  // Operation-level envelope codes, shared verbatim across every operation type.
  {
    code: "op_inner",
    category: "operation",
    label: "Applied",
    explanation: "The operation applied — see its operation-specific result for the details.",
    commonCauses: []
  },
  {
    code: "op_bad_auth",
    category: "operation",
    label: "Insufficient signatures for this operation",
    explanation: "Signatures are insufficient for this specific operation (for example, it names a source-account override that did not sign).",
    commonCauses: ["The operation specifies a different source account that did not sign."]
  },
  {
    code: "op_no_account",
    category: "operation",
    label: "Operation source account not found",
    explanation: "The operation's source account override does not exist.",
    commonCauses: ["The operation-level source account was never funded."]
  },
  {
    code: "op_not_supported",
    category: "operation",
    label: "Operation type not supported",
    explanation: "This operation type is not supported on the current network or protocol version.",
    commonCauses: ["The operation type was introduced in a later protocol version than the network runs."]
  },
  {
    code: "op_too_many_subentries",
    category: "operation",
    label: "Too many subentries",
    explanation: "This operation would push the account over the subentry limit (1000).",
    commonCauses: ["The account already has close to 1000 trustlines, offers, signers and data entries combined."]
  },
  {
    code: "op_exceeded_work_limit",
    category: "operation",
    label: "Exceeded work limit",
    explanation: "The operation would exceed the ledger's processing work limit.",
    commonCauses: ["The operation touches too much ledger state in one call."]
  },
  {
    code: "op_too_many_sponsoring",
    category: "operation",
    label: "Too many sponsoring",
    explanation: "This account would be sponsoring too many reserves.",
    commonCauses: ["The sponsorship limit has been reached for the sponsoring account."]
  },

  // Operation-specific codes: payment.
  {
    code: "malformed",
    category: "operation",
    operationType: "payment",
    label: "Malformed payment",
    explanation: "The payment amount or asset is invalid.",
    commonCauses: ["The amount is zero or negative.", "The asset code is invalid."]
  },
  {
    code: "underfunded",
    category: "operation",
    operationType: "payment",
    label: "Underfunded",
    explanation: "The source account does not have enough of the asset to send.",
    commonCauses: ["The balance is lower than the payment amount."]
  },
  {
    code: "src_no_trust",
    category: "operation",
    operationType: "payment",
    label: "Source has no trustline",
    explanation: "The source account does not have a trustline to the non-native asset it is trying to send.",
    commonCauses: ["The source never established a trustline for this asset."]
  },
  {
    code: "src_not_authorized",
    category: "operation",
    operationType: "payment",
    label: "Source not authorized",
    explanation: "The source account's trustline is not authorized by the issuer to send this asset.",
    commonCauses: ["The issuer requires authorization and has not granted it to the source."]
  },
  {
    code: "no_destination",
    category: "operation",
    operationType: "payment",
    label: "Destination not found",
    explanation: "The destination account does not exist.",
    commonCauses: ["The destination was never funded.", "Use create_account instead for a brand-new account."]
  },
  {
    code: "no_trust",
    category: "operation",
    operationType: "payment",
    label: "Destination has no trustline",
    explanation: "The destination account has no trustline for this non-native asset.",
    commonCauses: ["The destination never opted in to receive this asset."]
  },
  {
    code: "not_authorized",
    category: "operation",
    operationType: "payment",
    label: "Destination not authorized",
    explanation: "The destination's trustline is not authorized by the issuer.",
    commonCauses: ["The issuer requires authorization and has not granted it to the destination."]
  },
  {
    code: "line_full",
    category: "operation",
    operationType: "payment",
    label: "Destination trustline full",
    explanation: "The destination's trustline balance would exceed its configured limit.",
    commonCauses: ["The destination's trust limit is too low for the incoming amount."]
  },
  {
    code: "no_issuer",
    category: "operation",
    operationType: "payment",
    label: "Issuer not found",
    explanation: "The asset's issuer account does not exist.",
    commonCauses: ["The issuer account was never funded, or was merged away."]
  },

  // Operation-specific codes: create_account.
  {
    code: "malformed",
    category: "operation",
    operationType: "create_account",
    label: "Malformed create_account",
    explanation: "The starting balance or destination is invalid.",
    commonCauses: ["The destination is the same as the source account.", "The starting balance is negative."]
  },
  {
    code: "underfunded",
    category: "operation",
    operationType: "create_account",
    label: "Underfunded",
    explanation: "The source account does not have enough XLM to fund the new account and still cover its own reserve.",
    commonCauses: ["The starting balance plus the source's own reserve exceeds the source's balance."]
  },
  {
    code: "low_reserve",
    category: "operation",
    operationType: "create_account",
    label: "Starting balance too low",
    explanation: "The starting balance is below the minimum reserve required for a new account.",
    commonCauses: ["The starting balance is set below one base reserve (commonly 1 XLM)."]
  },
  {
    code: "already_exist",
    category: "operation",
    operationType: "create_account",
    label: "Account already exists",
    explanation: "An account already exists at the destination address.",
    commonCauses: ["create_account was used on an address that was already funded."]
  },

  // Operation-specific codes: change_trust.
  {
    code: "malformed",
    category: "operation",
    operationType: "change_trust",
    label: "Malformed change_trust",
    explanation: "The trustline limit or asset is invalid.",
    commonCauses: ["The limit is negative.", "The asset is malformed, or is the native asset."]
  },
  {
    code: "no_issuer",
    category: "operation",
    operationType: "change_trust",
    label: "Issuer not found",
    explanation: "The asset's issuer does not exist.",
    commonCauses: ["The issuer account was never funded, or was merged away."]
  },
  {
    code: "invalid_limit",
    category: "operation",
    operationType: "change_trust",
    label: "Invalid limit",
    explanation: "The limit is below the trustline's current balance.",
    commonCauses: ["Trying to lower the limit under the amount already held."]
  },
  {
    code: "low_reserve",
    category: "operation",
    operationType: "change_trust",
    label: "Insufficient reserve",
    explanation: "The source account does not have enough XLM to cover the new trustline's reserve.",
    commonCauses: ["Adding this trustline would push the account below its minimum balance."]
  },
  {
    code: "self_not_allowed",
    category: "operation",
    operationType: "change_trust",
    label: "Self-trust not allowed",
    explanation: "An account cannot create a trustline to an asset it itself issues.",
    commonCauses: ["The source account is the asset's own issuer."]
  },

  // Operation-specific codes: manage_sell_offer.
  {
    code: "malformed",
    category: "operation",
    operationType: "manage_sell_offer",
    label: "Malformed offer",
    explanation: "The offer's price or amount is invalid.",
    commonCauses: ["The price numerator or denominator is zero or negative."]
  },
  {
    code: "sell_no_trust",
    category: "operation",
    operationType: "manage_sell_offer",
    label: "No trustline for selling asset",
    explanation: "The source account has no trustline for the asset it is selling.",
    commonCauses: ["Missing trustline for the selling asset."]
  },
  {
    code: "buy_no_trust",
    category: "operation",
    operationType: "manage_sell_offer",
    label: "No trustline for buying asset",
    explanation: "The source account has no trustline for the asset it is buying.",
    commonCauses: ["Missing trustline for the buying asset."]
  },
  {
    code: "underfunded",
    category: "operation",
    operationType: "manage_sell_offer",
    label: "Underfunded",
    explanation: "The source account does not have enough of the selling asset.",
    commonCauses: ["The balance is lower than the offer amount."]
  },
  {
    code: "line_full",
    category: "operation",
    operationType: "manage_sell_offer",
    label: "Buying trustline full",
    explanation: "Accepting this offer would exceed the buying asset's trustline limit.",
    commonCauses: ["The trust limit for the buying asset is too low."]
  },
  {
    code: "not_found",
    category: "operation",
    operationType: "manage_sell_offer",
    label: "Offer not found",
    explanation: "The offer ID to update or delete does not exist.",
    commonCauses: ["The offer was already filled or cancelled.", "The wrong offer ID was supplied."]
  },
  {
    code: "low_reserve",
    category: "operation",
    operationType: "manage_sell_offer",
    label: "Insufficient reserve",
    explanation: "The source account does not have enough XLM reserve to create this new offer.",
    commonCauses: ["Adding this offer would push the account below its minimum balance."]
  }
];
