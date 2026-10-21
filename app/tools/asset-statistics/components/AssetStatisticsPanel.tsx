"use client";

import { Card } from "@/components/ui/Card";
import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { AssetStatisticsEmptyState } from "@/app/tools/asset-statistics/components/AssetStatisticsEmptyState";
import { AssetStatisticsForm } from "@/app/tools/asset-statistics/components/AssetStatisticsForm";
import { AssetStatisticsResult } from "@/app/tools/asset-statistics/components/AssetStatisticsResult";
import { AuthorizationBreakdown } from "@/app/tools/asset-statistics/components/AuthorizationBreakdown";
import { EmptyAssetState } from "@/app/tools/asset-statistics/components/EmptyAssetState";
import { SnapshotNotice } from "@/app/tools/asset-statistics/components/SnapshotNotice";
import { SupplySummary } from "@/app/tools/asset-statistics/components/SupplySummary";
import { copy } from "@/app/tools/asset-statistics/copy";
import { useAssetStatistics } from "@/app/tools/asset-statistics/hooks/useAssetStatistics";

export function AssetStatisticsPanel() {
  const { state, submit, network } = useAssetStatistics();
  const errorCode = state.status === "error" ? state.error.code : null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <CharacterPanel tone="trust" eyebrow={copy.eyebrow} title={copy.title} description={`${copy.character} Network: ${network}.`} />
      <Card className="space-y-5">
        <AssetStatisticsForm onSubmit={submit} loading={state.status === "loading"} errorCode={errorCode} />
        <div className="space-y-4" aria-live="polite">
          {state.status === "idle" ? <AssetStatisticsEmptyState /> : null}
          {state.status === "loading" ? (
            <StatusMessage type="info" title={copy.loadingTitle} description={copy.loadingBody} />
          ) : null}
          {state.status === "error" ? (
            <StatusMessage type="error" title={copy.errorTitles[state.error.code]} description={state.error.message} />
          ) : null}
          {state.status === "empty" ? (
            <>
              <SnapshotNotice capturedAt={state.result.capturedAt} />
              <EmptyAssetState result={state.result} />
              <SupplySummary result={state.result} />
              <AuthorizationBreakdown result={state.result} />
            </>
          ) : null}
          {state.status === "success" ? <AssetStatisticsResult result={state.result} /> : null}
        </div>
      </Card>
    </div>
  );
}
