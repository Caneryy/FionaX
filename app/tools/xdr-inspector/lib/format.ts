import { copy } from "../copy";
import type { XdrType } from "../types";

export function formatDetectedType(type: XdrType): string {
  return copy.types[type];
}

export function formatByteLength(bytes: number): string {
  return `${new Intl.NumberFormat("en-US").format(bytes)} ${copy.bytesUnit}`;
}
