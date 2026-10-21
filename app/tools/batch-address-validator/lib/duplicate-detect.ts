import type { EntryStatus } from "@/app/tools/batch-address-validator/types";

/**
 * Flag later copies of a valid address. The first copy stays valid.
 * Invalid text is never called a duplicate, even when it repeats.
 */
export function classifyEntries(entries: readonly { value: string; valid: boolean }[]): EntryStatus[] {
  const seen = new Set<string>();

  return entries.map((entry) => {
    if (!entry.valid) return "invalid";
    if (seen.has(entry.value)) return "duplicate";
    seen.add(entry.value);
    return "valid";
  });
}
