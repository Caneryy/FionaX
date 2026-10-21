import type { ParsedBatchEntry } from "@/app/tools/batch-address-validator/types";

/**
 * Split a paste on new lines and commas. Blank tokens are dropped so a trailing
 * comma does not become an entry. Line numbers still refer to the original paste.
 */
export function parseBatch(raw: string): ParsedBatchEntry[] {
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const entries: ParsedBatchEntry[] = [];

  normalized.split("\n").forEach((line, lineIndex) => {
    line.split(",").forEach((part) => {
      const value = part.trim();
      if (!value) return;

      entries.push({
        value,
        line: lineIndex + 1,
        index: entries.length
      });
    });
  });

  return entries;
}
