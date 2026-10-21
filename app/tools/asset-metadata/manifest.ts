import { ScrollText } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "asset-metadata",
  title: "Asset stellar.toml Metadata Viewer",
  description: "Show the CURRENCIES entry an issuer published for one asset code.",
  character: "A clerk reads stellar.toml and refuses to call it verified.",
  href: "/tools/asset-metadata",
  status: "MVP",
  icon: ScrollText
};
