import { WalletCards } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "freighter-connect",
  title: "Freighter Connect",
  description: "Try a browser wallet connection example.",
  character: "A friendly wallet mascot waves when Freighter is nearby.",
  href: "/tools/freighter-connect",
  status: "MVP",
  icon: WalletCards
};
