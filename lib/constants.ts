import { Landmark } from "lucide-react";

export type { ToolStatus } from "@/lib/tool-manifest";

// `tools` is generated from `app/tools/*/manifest.ts` by
// `scripts/generate-tools.mjs` (see lib/tools.generated.ts, gitignored).
// Adding a tool means creating its directory; this file never changes again.
export { tools } from "@/lib/tools.generated";

export const projectLinks = [
  {
    title: "GrantFox-ready MVP",
    description: "Built for a focused open-source Stellar project application.",
    icon: Landmark
  }
];
