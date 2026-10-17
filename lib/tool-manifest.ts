import type { ComponentType } from "react";

export type ToolStatus = "Working" | "MVP" | "Coming Soon";

export interface ToolManifest {
  slug: string;
  title: string;
  description: string;
  character: string;
  href: string;
  status: ToolStatus;
  icon: ComponentType<{ className?: string }>;
}
