"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { useResultCodeExplainer } from "@/app/tools/result-code-explainer/hooks/useResultCodeExplainer";
import { copy } from "@/app/tools/result-code-explainer/copy";
import { ResultCodeExplainerForm } from "@/app/tools/result-code-explainer/components/ResultCodeExplainerForm";
import { ResultCodeExplainerResult } from "@/app/tools/result-code-explainer/components/ResultCodeExplainerResult";
import { ResultCodeExplainerEmptyState } from "@/app/tools/result-code-explainer/components/ResultCodeExplainerEmptyState";
import { UnknownCodeNotice } from "@/app/tools/result-code-explainer/components/UnknownCodeNotice";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function ResultCodeExplainerPanel() {
  const { state, submit } = useResultCodeExplainer();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="moon" eyebrow="Developer utilities" title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <ResultCodeExplainerForm onSubmit={submit} />
        {state.status === "idle" ? <ResultCodeExplainerEmptyState /> : null}
        {state.status === "error" && state.error.code === "unknown_code" ? <UnknownCodeNotice /> : null}
        {state.status === "error" && state.error.code !== "unknown_code" ? (
          <StatusMessage type="error" title="Needs more information" description={copy.errors[state.error.code]} />
        ) : null}
        {state.status === "success" ? <ResultCodeExplainerResult result={state.result} /> : null}
      </Card>
    </div>
  );
}
