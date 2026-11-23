"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { MemoInspectorEmptyState } from "@/app/tools/memo-inspector/components/MemoInspectorEmptyState";
import { MemoInspectorForm } from "@/app/tools/memo-inspector/components/MemoInspectorForm";
import { MemoInspectorResult } from "@/app/tools/memo-inspector/components/MemoInspectorResult";
import { copy } from "@/app/tools/memo-inspector/copy";
import { useMemoInspector } from "@/app/tools/memo-inspector/hooks/useMemoInspector";
import { formatNetworkName } from "@/app/tools/memo-inspector/lib/format";

export function MemoInspectorPanel() {
  const { state, submit, network } = useMemoInspector();
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
        <MemoInspectorForm onSubmit={submit} loading={loading} invalid={state.status === "error"} />
        <div aria-live="polite" className="space-y-4">
          {state.status === "idle" ? <MemoInspectorEmptyState /> : null}
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
          {state.status === "success" ? <MemoInspectorResult result={state.result} /> : null}
        </div>
      </Card>
    </div>
  );
}
