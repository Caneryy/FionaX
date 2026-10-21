import { Flag } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "asset-flags-inspector",
  title: "Asset Issuer Flags Inspector",
  description: "Read an issuer account and explain the authorization and clawback flags in plain language.",
  character: "A careful clerk reads the issuer's rule card and says what holders should expect.",
  href: "/tools/asset-flags-inspector",
  status: "MVP",
  icon: Flag
};
