import { QrCode } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "payment-qr",
  title: "Payment QR Generator",
  description: "Create demo Stellar payment request QR codes.",
  character: "A rocket assistant frames payment details as a QR poster.",
  href: "/tools/payment-qr",
  status: "Working",
  icon: QrCode
};
