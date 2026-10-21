import { Landmark } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "reserve-calculator",
  title: "Account Reserve Calculator",
  description: "Calculate an account's minimum XLM base reserve from its subentries and flags, and show what's available above it.",
  character: "An accountant who tallies every subentry before telling you what's really spendable.",
  href: "/tools/reserve-calculator",
  status: "MVP",
  icon: Landmark
};
