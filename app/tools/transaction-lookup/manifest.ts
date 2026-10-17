import { Search } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "transaction-lookup",
  title: "Transaction Lookup",
  description: "Look up testnet transactions by hash.",
  character: "A detective comet follows transaction trails through Horizon.",
  href: "/tools/transaction-lookup",
  status: "MVP",
  icon: Search
};
