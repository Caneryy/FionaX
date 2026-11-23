import { Droplets } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
import { copy } from "./copy";

export const manifest: ToolManifest = {
  slug: "liquidity-pool-inspector",
  title: copy.title,
  description: copy.description,
  character: copy.manifestCharacter,
  href: "/tools/liquidity-pool-inspector",
  status: "Working",
  icon: Droplets
};
