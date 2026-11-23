import { Gauge } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
import { copy } from "./copy";

export const manifest: ToolManifest = {
  slug: "fee-stats",
  title: copy.title,
  description: copy.description,
  character: copy.manifestCharacter,
  href: "/tools/fee-stats",
  status: "Working",
  icon: Gauge
};
