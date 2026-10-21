import { copy } from "../copy";
import { formatByteLength } from "../lib/format";
import type { XdrInspectorResult as Result } from "../types";
import { DecodedTree } from "./DecodedTree";
import { DetectedTypeBadge } from "./DetectedTypeBadge";

export function XdrInspectorResult({ result }: { result: Result }) {
  return <section className="space-y-3" aria-labelledby="xdr-result-title">
    <h2 id="xdr-result-title" className="font-bold text-[#172033]">{copy.resultTitle}</h2>
    <div className="flex flex-wrap items-center gap-3">
      <DetectedTypeBadge type={result.type} />
      <span className="text-sm text-[#5d6b82]">{copy.sizeLabel}: {formatByteLength(result.byteLength)}</span>
    </div>
    <DecodedTree json={result.json} />
  </section>;
}
