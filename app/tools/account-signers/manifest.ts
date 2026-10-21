import { KeyRound } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "account-signers",
  title: "Account Signers & Thresholds",
  description: "Show an account's signers, their weights, and the low, medium, and high thresholds together.",
  character: "A clerk lays out every key that can sign, and the weight each threshold still needs.",
  href: "/tools/account-signers",
  status: "MVP",
  icon: KeyRound
};
