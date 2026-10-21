import type { Metadata } from "next";
import { AssetMetadataPanel } from "@/app/tools/asset-metadata/components/AssetMetadataPanel";
import { copy } from "@/app/tools/asset-metadata/copy";

export const metadata: Metadata = {
  title: copy.title,
  description: copy.intro
};

export default function AssetMetadataPage() {
  return <AssetMetadataPanel />;
}
