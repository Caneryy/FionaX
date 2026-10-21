import { ShieldCheck } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "batch-address-validator",
  title: "Batch Address Validator",
  description: "Validate a pasted list of Stellar public addresses and flag invalid or duplicate entries.",
  character: "A careful star clerk checks a stack of public key badges and turns away secret seeds.",
  href: "/tools/batch-address-validator",
  status: "Working",
  icon: ShieldCheck
};
