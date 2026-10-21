import { ListFilter } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
import { copy } from "./copy";

export const manifest: ToolManifest = {
  slug: "effects-timeline",
  title: copy.title,
  description: copy.manifestDescription,
  character: copy.manifestCharacter,
  href: "/tools/effects-timeline",
  status: "MVP",
  icon: ListFilter
};
