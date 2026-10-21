import { BarChart3 } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "asset-statistics",
  title: "Asset Supply & Trustline Statistics",
  description: "Read one issued asset's circulating supply, holder counts, and trustline authorization from Horizon.",
  character: "A supply clerk counts trustlines from a single Horizon snapshot.",
  href: "/tools/asset-statistics",
  status: "MVP",
  icon: BarChart3
};
