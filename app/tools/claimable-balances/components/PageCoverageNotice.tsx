import { copy } from "../copy";

export function PageCoverageNotice({ pages, limit, nextCursor }: { pages: number; limit: number; nextCursor?: string }) {
  return <div className="rounded-md border border-[#82cbe3] bg-[#e0f6ff] p-3 text-sm text-[#146783]">
    <p>{copy.coverage(pages, limit)}</p>
    {nextCursor ? <p className="mt-1 break-all">{copy.nextCursor}: <code>{nextCursor}</code></p> : null}
  </div>;
}
