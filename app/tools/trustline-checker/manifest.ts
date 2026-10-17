import { BadgeCheck } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "trustline-checker",
  title: "Trustline Checker",
  description: "Check whether an account trusts a specific issued asset.",
  character: "A tiny inspector looks for asset handshakes.",
  href: "/tools/trustline-checker",
  status: "MVP",
  icon: BadgeCheck
};
