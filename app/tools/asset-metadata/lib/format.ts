import { copy } from "@/app/tools/asset-metadata/copy";
import { isSecretSeed } from "@/app/tools/asset-metadata/schema";
import type { FieldKind } from "@/app/tools/asset-metadata/types";
import type { TomlValue } from "@/app/tools/asset-metadata/lib/stellar-toml";

// Group a base-10 integer string with BigInt so large supplies never pass through Number.
export function formatAmount(digits: string): string {
  const negative = digits.startsWith("-");
  const body = negative ? digits.slice(1) : digits;
  if (!/^\d+$/.test(body)) {
    throw new Error("Amount must be a base-10 integer string.");
  }

  const canonical = BigInt(body).toString();
  const grouped = canonical.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (canonical === "0") return "0";
  return negative ? `-${grouped}` : grouped;
}

export function httpsUrl(value: TomlValue | undefined): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function redact(value: string): string {
  if (isSecretSeed(value.trim())) return copy.redactedSecret;
  return value;
}

export function formatTomlValue(value: TomlValue, kind: FieldKind): string {
  if (typeof value === "boolean") {
    return value ? copy.booleanYes : copy.booleanNo;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redact(item)).join("\n");
  }

  const safe = redact(value);
  if (safe !== value) return safe;

  if ((kind === "amount" || kind === "integer") && /^-?\d+$/.test(value)) {
    return kind === "amount" ? formatAmount(value) : value;
  }

  return value;
}
