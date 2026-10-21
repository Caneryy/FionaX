import { WalletCards } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
import { copy } from "./copy";

export const manifest: ToolManifest = {
  slug: "claimable-balances",
  title: copy.title,
  description: copy.description,
  character: copy.manifestCharacter,
  href: "/tools/claimable-balances",
  status: "Working",
  icon: WalletCards
};
