import { GitMerge } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "account-merge-preflight",
  title: "Account Merge Preflight Check",
  description: "Check whether a source account looks eligible to merge into a destination before anyone builds the transaction.",
  character: "A clerk walks the source account and lists every reason a merge would be refused.",
  href: "/tools/account-merge-preflight",
  status: "MVP",
  icon: GitMerge
};
