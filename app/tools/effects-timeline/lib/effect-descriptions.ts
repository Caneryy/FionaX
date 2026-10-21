import { effectDescriptions } from "../copy";
import { isUnknownEffect, unknownEffectLabel } from "./unknown-effect";
import type { TimelineEffect } from "../types";

export function describeEffect(effect: TimelineEffect): string {
  return isUnknownEffect(effect)
    ? unknownEffectLabel(effect)
    : effectDescriptions[effect.type](effect);
}

export function knownEffectTypes(): string[] {
  return Object.keys(effectDescriptions);
}
