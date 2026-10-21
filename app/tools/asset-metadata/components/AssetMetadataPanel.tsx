"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "@/app/tools/asset-metadata/copy";
import { AssetMetadataEmptyState } from "@/app/tools/asset-metadata/components/AssetMetadataEmptyState";
import { AssetMetadataForm } from "@/app/tools/asset-metadata/components/AssetMetadataForm";
import { AssetMetadataLoadingState } from "@/app/tools/asset-metadata/components/AssetMetadataLoadingState";
import { AssetMetadataResult } from "@/app/tools/asset-metadata/components/AssetMetadataResult";
import { TomlErrorState } from "@/app/tools/asset-metadata/components/TomlErrorState";
import { useAssetMetadata } from "@/app/tools/asset-metadata/hooks/useAssetMetadata";
import { isTomlDocumentError } from "@/app/tools/asset-metadata/lib/state";

export function AssetMetadataPanel() {
  const { state, submit, networkLabel } = useAssetMetadata();

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl space-y-6">
      <CharacterPanel tone="detective" eyebrow={copy.eyebrow} title={copy.title} description={copy.intro} />
      <Card className="space-y-5">
        <AssetMetadataForm onSubmit={submit} loading={state.status === "loading"} networkLabel={networkLabel} />
        {state.status === "idle" ? <AssetMetadataEmptyState /> : null}
        {state.status === "loading" ? <AssetMetadataLoadingState /> : null}
        {state.status === "error" && isTomlDocumentError(state.error.code) ? <TomlErrorState code={state.error.code} /> : null}
        {state.status === "error" && !isTomlDocumentError(state.error.code) ? (
          <StatusMessage type="error" title={copy.errorTitle} description={state.error.message} />
        ) : null}
        {state.status === "success" ? <AssetMetadataResult result={state.result} /> : null}
      </Card>
    </div>
  );
}
