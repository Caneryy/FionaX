import { HandCoins } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
import { copy } from "./copy";

export const manifest: ToolManifest = {
  slug: "sponsored-reserves",
  title: copy.title,
  description: copy.manifestDescription,
  character: copy.character,
  href: "/tools/sponsored-reserves",
  status: "Working",
  icon: HandCoins
};
