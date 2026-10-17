import { Droplets } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "testnet-faucet",
  title: "Testnet Faucet Helper",
  description: "Fund a testnet account with Friendbot.",
  character: "A faucet character pours harmless testnet XLM.",
  href: "/tools/testnet-faucet",
  status: "Working",
  icon: Droplets
};
