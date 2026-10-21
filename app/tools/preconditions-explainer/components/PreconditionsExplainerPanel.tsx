"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { usePreconditionsExplainer } from "@/app/tools/preconditions-explainer/hooks/usePreconditionsExplainer";
import { copy } from "@/app/tools/preconditions-explainer/copy";
import { PreconditionsExplainerForm } from "@/app/tools/preconditions-explainer/components/PreconditionsExplainerForm";
import { PreconditionsExplainerResult } from "@/app/tools/preconditions-explainer/components/PreconditionsExplainerResult";
import { PreconditionsExplainerEmptyState } from "@/app/tools/preconditions-explainer/components/PreconditionsExplainerEmptyState";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function PreconditionsExplainerPanel() {
  const { state, submit } = usePreconditionsExplainer();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="detective" eyebrow="Transactions" title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <PreconditionsExplainerForm onSubmit={submit} />
        {state.status === "idle" ? <PreconditionsExplainerEmptyState /> : null}
        {state.status === "error" ? (
          <StatusMessage type="error" title="Could not read that envelope" description={copy.errors[state.error.code]} />
        ) : null}
        {state.status === "success" ? <PreconditionsExplainerResult result={state.result} /> : null}
      </Card>
    </div>
  );
}
