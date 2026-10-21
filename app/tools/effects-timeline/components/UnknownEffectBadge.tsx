import { copy } from "../copy";

export function UnknownEffectBadge() {
  return <span className="rounded-full bg-[#fff2e9] px-2 py-1 text-xs font-semibold text-[#9a513f]">{copy.unknown}</span>;
}
