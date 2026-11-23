import type { StellarNetwork } from "@/lib/stellar/horizon";
import type { BrowserOperation } from "../types";
import { copy } from "../copy";
import { summarizeOperation } from "../lib/operation-summaries";
import { isUnknownOperation } from "../lib/unknown-operation";
import { formatOperationTime, transactionExplorerUrl } from "../lib/format";
import { UnknownOperationBadge } from "./UnknownOperationBadge";

export function OperationRows({ operations, network }: { operations: BrowserOperation[]; network: StellarNetwork }) {
  return <ol className="divide-y divide-[#cfe0ea]">
    {operations.map((operation) => <li key={operation.pagingToken} className="space-y-2 py-4 first:pt-0">
      <div className="flex flex-wrap items-center gap-2">
        <time className="text-xs text-[#68758a]" dateTime={operation.createdAt ?? undefined}>
          {formatOperationTime(operation.createdAt)}
        </time>
        {isUnknownOperation(operation) ? <UnknownOperationBadge /> : null}
      </div>
      <p className="text-sm font-medium text-[#172033] break-words">{summarizeOperation(operation)}</p>
      <p className="text-xs text-[#68758a] break-all">{operation.type}</p>
      <a
        href={transactionExplorerUrl(network, operation.transactionHash)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex text-sm font-semibold text-[#178fb5] hover:underline"
      >
        {copy.viewTransaction}
      </a>
    </li>)}
  </ol>;
}
