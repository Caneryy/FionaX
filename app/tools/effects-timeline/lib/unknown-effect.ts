import { effectDescriptions } from "../copy";
import type { TimelineEffect } from "../types";

export function isUnknownEffect(effect: TimelineEffect): boolean {
  return !Object.hasOwn(effectDescriptions, effect.type);
}

export function unknownEffectLabel(effect: TimelineEffect): string {
  return effect.type;
}
