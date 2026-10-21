import { BookOpenCheck } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "result-code-explainer",
  title: "Result Code Explainer",
  description: "Look up a Horizon or protocol result code and explain what it means and its most common causes.",
  character: "A reference librarian who always checks the index before answering.",
  href: "/tools/result-code-explainer",
  status: "MVP",
  icon: BookOpenCheck
};
