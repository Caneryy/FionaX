"use client";

import { Card } from "@/components/ui/Card";
import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";
import { useXdrInspector } from "../hooks/useXdrInspector";
import { XdrInspectorEmptyState } from "./XdrInspectorEmptyState";
import { XdrInspectorForm } from "./XdrInspectorForm";
import { XdrInspectorResult } from "./XdrInspectorResult";
import { UndetectedNotice } from "./UndetectedNotice";

export function XdrInspectorPanel() {
  const { state, submit } = useXdrInspector();
  return <div className="mx-auto max-w-4xl space-y-6">
    <CharacterPanel tone="detective" eyebrow={copy.eyebrow} title={copy.title} description={copy.intro} />
    <Card className="space-y-5">
      <XdrInspectorForm onSubmit={submit} loading={state.status === "loading"} />
      <div aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "idle" ? <XdrInspectorEmptyState /> : null}
        {state.status === "loading" ? <p className="text-sm text-[#5d6b82]">{copy.loading}</p> : null}
        {state.status === "success" ? <XdrInspectorResult result={state.result} /> : null}
        {state.status === "error" && state.error.code === "undetected_type" ? <UndetectedNotice /> : null}
        {state.status === "error" && state.error.code !== "undetected_type" ?
          <StatusMessage type="error" title={copy.errorTitle} description={copy.errors[state.error.code]} /> : null}
      </div>
    </Card>
  </div>;
}
