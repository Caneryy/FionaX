import { copy } from "../copy";
import { formatDetectedType } from "../lib/format";
import type { XdrType } from "../types";

export function DetectedTypeBadge({ type }: { type: XdrType }) {
  return <p className="inline-block rounded-full bg-[#dff8ee] px-3 py-1 text-sm font-semibold text-[#17664b]">
    {copy.detectedLabel}: {formatDetectedType(type)}
  </p>;
}
