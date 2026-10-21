import { copy } from "../copy";

export function formatEffectTime(value: string | null): string {
  if (!value || Number.isNaN(Date.parse(value))) return copy.timeUnavailable;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium", timeStyle: "short", timeZone: "UTC"
  }).format(new Date(value)) + " UTC";
}

export function shortAccountId(value: string): string {
  return `${value.slice(0, 6)}…${value.slice(-6)}`;
}
