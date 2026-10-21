"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { AssetFlagsInspectorEmptyState } from "@/app/tools/asset-flags-inspector/components/AssetFlagsInspectorEmptyState";
import { AssetFlagsInspectorForm } from "@/app/tools/asset-flags-inspector/components/AssetFlagsInspectorForm";
import { AssetFlagsInspectorResult } from "@/app/tools/asset-flags-inspector/components/AssetFlagsInspectorResult";
import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { useAssetFlagsInspector } from "@/app/tools/asset-flags-inspector/hooks/useAssetFlagsInspector";
import { formatNetworkName } from "@/app/tools/asset-flags-inspector/lib/format";

export function AssetFlagsInspectorPanel() {
  const { state, submit, network } = useAssetFlagsInspector();
  const loading = state.status === "loading";

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl space-y-6">
      <CharacterPanel
        tone="detective"
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={`${copy.idle} ${copy.result.networkLabel}: ${formatNetworkName(network)}.`}
      />
      <Card className="space-y-5">
        <AssetFlagsInspectorForm onSubmit={submit} loading={loading} invalid={state.status === "error"} />
        <div aria-live="polite" className="space-y-4">
          {state.status === "idle" ? <AssetFlagsInspectorEmptyState /> : null}
          {state.status === "loading" ? (
            <div role="status">
              <StatusMessage type="info" title={copy.loadingTitle} description={copy.loading} />
            </div>
          ) : null}
          {state.status === "error" ? (
            <div role="alert">
              <StatusMessage type="error" title={copy.errorTitles[state.error.code]} description={state.error.message} />
            </div>
          ) : null}
          {state.status === "success" ? <AssetFlagsInspectorResult result={state.result} /> : null}
        </div>
      </Card>
    </div>
  );
}
