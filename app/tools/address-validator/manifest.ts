import { ShieldCheck } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "address-validator",
  title: "Address Validator",
  description: "Validate Stellar public keys and explain address format issues.",
  character: "A careful star clerk checks every public key badge.",
  href: "/tools/address-validator",
  status: "Working",
  icon: ShieldCheck
};
