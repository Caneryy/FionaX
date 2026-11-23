import { StickyNote } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "memo-inspector",
  title: "Transaction Memo Inspector",
  description: "Decode a transaction memo by type — text, id, hash, or return — with hex and base64 when needed.",
  character: "A clerk opens the memo field, names its type, and lays out the raw and decoded forms side by side.",
  href: "/tools/memo-inspector",
  status: "MVP",
  icon: StickyNote
};
