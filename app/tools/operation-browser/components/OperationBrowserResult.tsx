import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";
import { shortAccountId } from "../lib/format";
import type { OperationBrowserError, OperationBrowserResult as Result } from "../types";
import { EmptyOperationsState } from "./EmptyOperationsState";
import { LoadMoreButton } from "./LoadMoreButton";
import { OperationRows } from "./OperationRows";

interface Props {
  result: Result;
  loadingMore: boolean;
  pageError: OperationBrowserError | null;
  onLoadMore: () => void;
}

export function OperationBrowserResult({ result, loadingMore, pageError, onLoadMore }: Props) {
  return <section className="space-y-4" aria-label={copy.resultTitle}>
    <div>
      <h2 className="text-lg font-extrabold text-[#172033]">{copy.resultTitle}</h2>
      <p className="text-sm text-[#68758a]">{shortAccountId(result.accountId)} · {result.network} · {copy.resultCount(result.operations.length)}</p>
    </div>
    {result.operations.length === 0 ? <EmptyOperationsState /> : <OperationRows operations={result.operations} network={result.network} />}
    {pageError ? <StatusMessage type="error" title={copy.pageErrorTitle} description={copy.errors[pageError.code]} /> : null}
    {result.nextCursor ? <LoadMoreButton loading={loadingMore} onClick={onLoadMore} /> : null}
  </section>;
}
