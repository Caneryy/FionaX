import type { TimelineEffect } from "../types";
import { describeEffect } from "../lib/effect-descriptions";
import { isUnknownEffect } from "../lib/unknown-effect";
import { formatEffectTime } from "../lib/format";
import { UnknownEffectBadge } from "./UnknownEffectBadge";

export function EffectRows({ effects }: { effects: TimelineEffect[] }) {
  return <ol className="divide-y divide-[#cfe0ea]">
    {effects.map((effect) => <li key={effect.pagingToken} className="space-y-2 py-4 first:pt-0">
      <div className="flex flex-wrap items-center gap-2">
        <time className="text-xs text-[#68758a]" dateTime={effect.createdAt ?? undefined}>
          {formatEffectTime(effect.createdAt)}
        </time>
        {isUnknownEffect(effect) ? <UnknownEffectBadge /> : null}
      </div>
      <p className="text-sm font-medium text-[#172033] break-words">{describeEffect(effect)}</p>
      <p className="text-xs text-[#68758a] break-all">{effect.type}</p>
    </li>)}
  </ol>;
}
