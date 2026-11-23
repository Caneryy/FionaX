import { ListOrdered } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
import { copy } from "./copy";

export const manifest: ToolManifest = {
  slug: "operation-browser",
  title: copy.title,
  description: copy.manifestDescription,
  character: copy.manifestCharacter,
  href: "/tools/operation-browser",
  status: "MVP",
  icon: ListOrdered
};
