import type { LiquidityPoolInspectorResult as Result } from "../types";
import { copy } from "../copy";
import { formatPoolId, formatShares } from "../lib/format";
import { ImpliedPrice } from "./ImpliedPrice";
import { PoolFeeNotice } from "./PoolFeeNotice";
import { ReserveRows } from "./ReserveRows";

export function LiquidityPoolInspectorResult({ result }: { result: Result }) {
  return (
    <section className="space-y-4" aria-label={copy.resultTitle}>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-[#29364d]">{copy.poolId}</dt>
          <dd className="break-all font-mono text-xs" title={result.poolId}>
            {formatPoolId(result.poolId)}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[#29364d]">{copy.poolType}</dt>
          <dd>{result.type}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#29364d]">{copy.totalShares}</dt>
          <dd className="font-mono tabular-nums">{formatShares(result.totalShares)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[#29364d]">{copy.totalTrustlines}</dt>
          <dd className="font-mono tabular-nums">{result.totalTrustlines}</dd>
        </div>
      </dl>
      <ReserveRows reserves={result.reserves} />
      <PoolFeeNotice feeBp={result.feeBp} />
      <ImpliedPrice prices={result.prices} />
    </section>
  );
}
