import { copy } from "@/app/tools/asset-statistics/copy";
import { formatSnapshotTime } from "@/app/tools/asset-statistics/lib/format";

export function SnapshotNotice({ capturedAt }: { capturedAt: string }) {
  return (
    <p role="note" className="rounded-lg border border-[#82cbe3]/70 bg-[#e0f6ff] px-4 py-3 text-sm leading-6 text-[#146783]">
      {copy.snapshotNotice}{" "}
      <span className="font-extrabold">
        {copy.snapshotCapturedLabel} <time dateTime={capturedAt}>{formatSnapshotTime(capturedAt)}</time>
      </span>
    </p>
  );
}
