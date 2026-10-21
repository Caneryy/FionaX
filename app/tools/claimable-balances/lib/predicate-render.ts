import { copy } from "../copy";
import type { Predicate } from "../types";
import { ToolFailure } from "./claimableBalances.errors";
import { formatUtc } from "./format";

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ToolFailure("malformed_predicate");
  return value as Record<string, unknown>;
}

export function decodePredicate(raw: unknown, depth = 0): Predicate {
  if (depth > 32) throw new ToolFailure("malformed_predicate");
  const value = record(raw);
  const keys = Object.keys(value);
  if (keys.length !== 1 && !(keys.length === 2 && keys.includes("absBefore") && keys.includes("absBeforeEpoch"))) throw new ToolFailure("malformed_predicate");
  const kind = keys.includes("absBefore") ? "absBefore" : keys[0];
  const content = value[kind];
  if (kind === "unconditional" && content === true) return { kind };
  if (kind === "absBefore" && typeof content === "string" && /^[+-]?[0-9]{4,12}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/.test(content) &&
      (value.absBeforeEpoch === undefined || (typeof value.absBeforeEpoch === "string" && /^-?[0-9]{1,20}$/.test(value.absBeforeEpoch)))) {
    return { kind: "abs_before", value: content };
  }
  if (kind === "absBeforeEpoch" && typeof content === "string" && /^-?[0-9]{1,20}$/.test(content)) return { kind: "abs_before_epoch", value: content };
  if (kind === "relBefore" && typeof content === "string" && /^[0-9]{1,20}$/.test(content)) return { kind: "rel_before", value: content };
  if ((kind === "and" || kind === "or") && Array.isArray(content) && content.length >= 2 && content.length <= 32) {
    return { kind, children: content.map((child) => decodePredicate(child, depth + 1)) };
  }
  if (kind === "not") return { kind, child: decodePredicate(content, depth + 1) };
  throw new ToolFailure("malformed_predicate");
}

export function predicateLabel(predicate: Predicate): string {
  switch (predicate.kind) {
    case "unconditional": return copy.unconditional;
    case "abs_before": return `${copy.absBefore}: ${formatUtc(predicate.value)}`;
    case "abs_before_epoch": return `${copy.absBeforeEpoch}: ${predicate.value}`;
    case "rel_before": return `${copy.relBefore}: ${predicate.value}`;
    case "and": return copy.and;
    case "or": return copy.or;
    case "not": return copy.not;
  }
}
