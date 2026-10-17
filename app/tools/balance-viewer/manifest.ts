import { CircleDollarSign } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "balance-viewer",
  title: "Balance Viewer",
  description: "Inspect testnet account balances through Horizon.",
  character: "A moon wallet opens its pockets for testnet balances.",
  href: "/tools/balance-viewer",
  status: "Working",
  icon: CircleDollarSign
};
