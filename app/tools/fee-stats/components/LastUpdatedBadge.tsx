import { copy } from "../copy";
import { formatFetchedAt } from "../lib/format";

export function LastUpdatedBadge({ fetchedAt }: { fetchedAt: string }) {
  return (
    <p className="text-xs text-[#68758a]" aria-live="polite">
      <span className="font-medium text-[#29364d]">{copy.lastUpdatedLabel}: </span>
      <time dateTime={fetchedAt}>{formatFetchedAt(fetchedAt)}</time>
    </p>
  );
}
