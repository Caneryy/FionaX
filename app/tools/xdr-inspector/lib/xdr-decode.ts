import type { DetectedXdr } from "./xdr-detect";
import { stringifyXdr } from "./bigint-json";

export function decodeXdr(detected: DetectedXdr): string {
  return stringifyXdr(detected.value);
}
