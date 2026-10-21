import { Database } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "account-data-entries",
  title: "Account Data Entries Viewer",
  description: "List an account's manage-data entries and decode each base64 value without guessing the encoding.",
  character: "A clerk opens the account's data drawer and reads each card in the encoding it actually uses.",
  href: "/tools/account-data-entries",
  status: "MVP",
  icon: Database
};
