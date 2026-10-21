import { StrKey } from "@stellar/stellar-sdk";

/** Full ed25519 secret-seed shape: S plus 55 StrKey base32 characters. */
const SECRET_SEED_SHAPE = /S[A-Z2-7]{55}/;

/**
 * True when an entry is a secret seed or starts like one.
 * The matched text is never returned, so callers cannot echo it.
 */
export function isSecretSeedShape(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  // Prefix alone is enough. A short or partial seed must not fall through
  // into a result row that would print it back.
  if (/^s/i.test(trimmed)) return true;

  const compact = trimmed.replace(/\s+/g, "").toUpperCase();
  if (SECRET_SEED_SHAPE.test(compact)) return true;

  return StrKey.isValidEd25519SecretSeed(trimmed) || StrKey.isValidEd25519SecretSeed(compact);
}

export function batchContainsSecretSeed(entries: readonly { value: string }[]): boolean {
  return entries.some((entry) => isSecretSeedShape(entry.value));
}
