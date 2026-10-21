import { ListChecks } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "preconditions-explainer",
  title: "Transaction Preconditions Explainer",
  description:
    "Decode a pasted transaction envelope's preconditions and explain in plain language when it is eligible to be submitted.",
  character: "A notary who reads every clause aloud before anyone signs.",
  href: "/tools/preconditions-explainer",
  status: "MVP",
  icon: ListChecks
};
