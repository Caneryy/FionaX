import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { ISSUER_FLAG_KEYS, type FlagExplanationModel, type IssuerFlags } from "@/app/tools/asset-flags-inspector/types";

/**
 * Turns the four flags into holder-facing sentences.
 * auth_immutable is also returned as its own notice so the lock is not just another row.
 */
export function explainIssuerFlags(flags: IssuerFlags): FlagExplanationModel {
  const rows = ISSUER_FLAG_KEYS.map((key) => {
    const enabled = flags[key];
    const text = copy.flags[key];

    return {
      key,
      enabled,
      label: text.label,
      detail: enabled ? text.enabled : text.disabled
    };
  });

  const allUnset = rows.every((row) => !row.enabled);

  return {
    rows,
    combination: rows.map((row) => row.detail).join(" "),
    immutableNotice: flags.auth_immutable ? copy.immutable.body : null,
    adjustableNotice: flags.auth_immutable ? null : copy.adjustable.body,
    allUnset
  };
}
