import { SIGNER_TYPES, type SignerKind } from "@/app/tools/account-signers/types";

/** Classify a Horizon signer type. Hash and pre-auth keys are not checked as addresses. */
export function classifySignerType(type: string): SignerKind | null {
  if ((SIGNER_TYPES as readonly string[]).includes(type)) {
    return type as SignerKind;
  }

  return null;
}
