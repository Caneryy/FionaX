import { ArrowLeftRight } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "amount-converter",
  title: "Stroop & Decimal Amount Converter",
  description: "Convert a Stellar amount between decimal form and exact stroops, in both directions.",
  character: "A clerk moves a figure between the human scale and the integer scale without rounding.",
  href: "/tools/amount-converter",
  status: "MVP",
  icon: ArrowLeftRight
};
