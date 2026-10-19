import { ScanSearch } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
import { copy } from "./copy";

export const manifest: ToolManifest = {
  slug: "xdr-inspector",
  title: copy.title,
  description: copy.manifestDescription,
  character: copy.manifestCharacter,
  href: "/tools/xdr-inspector",
  status: "MVP",
  icon: ScanSearch
};
