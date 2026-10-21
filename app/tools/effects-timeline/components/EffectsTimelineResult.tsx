import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";
import { shortAccountId } from "../lib/format";
import type { EffectsTimelineError, EffectsTimelineResult as Result } from "../types";
import { EffectRows } from "./EffectRows";
import { EmptyEffectsState } from "./EmptyEffectsState";
import { LoadMoreButton } from "./LoadMoreButton";

interface Props {
  result: Result;
  loadingMore: boolean;
  pageError: EffectsTimelineError | null;
  onLoadMore: () => void;
}

export function EffectsTimelineResult({ result, loadingMore, pageError, onLoadMore }: Props) {
  return <section className="space-y-4" aria-label={copy.resultTitle}>
    <div>
      <h2 className="text-lg font-extrabold text-[#172033]">{copy.resultTitle}</h2>
      <p className="text-sm text-[#68758a]">{shortAccountId(result.accountId)} · {result.network} · {copy.resultCount(result.effects.length)}</p>
    </div>
    {result.effects.length === 0 ? <EmptyEffectsState /> : <EffectRows effects={result.effects} />}
    {pageError ? <StatusMessage type="error" title={copy.pageErrorTitle} description={copy.errors[pageError.code]} /> : null}
    {result.nextCursor ? <LoadMoreButton loading={loadingMore} onClick={onLoadMore} /> : null}
  </section>;
}
