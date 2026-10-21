import { NAME_BYTE_LIMIT, NAME_NEAR_LIMIT } from "@/app/tools/account-data-entries/types";

/** UTF-8 byte length of a manage-data name. */
export function entryNameBytes(name: string): number {
  return new TextEncoder().encode(name).length;
}

/**
 * True when the name is within eight bytes of the 64-byte protocol limit,
 * including a name that is exactly 64 bytes.
 */
export function isNearNameLimit(name: string): boolean {
  const bytes = entryNameBytes(name);
  return bytes >= NAME_NEAR_LIMIT && bytes <= NAME_BYTE_LIMIT;
}

export function isOverNameLimit(name: string): boolean {
  return entryNameBytes(name) > NAME_BYTE_LIMIT;
}
