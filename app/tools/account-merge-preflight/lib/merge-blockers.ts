import { copy } from "@/app/tools/account-merge-preflight/copy";
import type { BlockerCode, MergeBlocker, SourceSnapshot } from "@/app/tools/account-merge-preflight/types";

const ORDER: BlockerCode[] = ["trustlines", "offers", "data_entries", "extra_signers", "sponsorship", "destination_missing"];

/** Collect every known account_merge blocker. Do not stop at the first one. */
export function collectMergeBlockers(snapshot: SourceSnapshot, destinationExists: boolean): MergeBlocker[] {
  const present = new Set<BlockerCode>();

  if (snapshot.trustlineCount > 0) present.add("trustlines");
  if (snapshot.offerCount > 0) present.add("offers");
  if (snapshot.dataEntryCount > 0) present.add("data_entries");
  if (snapshot.extraSignerCount > 0) present.add("extra_signers");
  if (snapshot.sponsoring) present.add("sponsorship");
  if (!destinationExists) present.add("destination_missing");

  return ORDER.filter((code) => present.has(code)).map((code) => ({
    code,
    title: copy.blockers[code].title,
    detail: copy.blockers[code].detail
  }));
}
