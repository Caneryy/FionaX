import { copy } from "@/app/tools/asset-metadata/copy";

export function AssetMetadataLoadingState() {
  return (
    <p role="status" aria-live="polite" className="text-sm leading-6 text-[#146783]">
      {copy.loading}
    </p>
  );
}
