"use client";

import { useNetwork } from "@/components/stellar/NetworkProvider";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import { Card } from "@/components/ui/Card";
import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";
import { useEffectsTimeline } from "../hooks/useEffectsTimeline";
import { EffectsTimelineEmptyState } from "./EffectsTimelineEmptyState";
import { EffectsTimelineForm } from "./EffectsTimelineForm";
import { EffectsTimelineResult } from "./EffectsTimelineResult";

export function EffectsTimelinePanel() {
  const { network } = useNetwork();
  return <EffectsTimelineContent key={network} network={network} />;
}

function EffectsTimelineContent({ network }: { network: StellarNetwork }) {
  const { state, submit, loadMore } = useEffectsTimeline(network);
  return <div className="mx-auto max-w-3xl space-y-6">
    <CharacterPanel tone="detective" eyebrow={copy.eyebrow} title={copy.title} description={copy.intro} />
    <Card className="space-y-5">
      <EffectsTimelineForm onSubmit={submit} loading={state.status === "loading"} />
      <div aria-live="polite">
        {state.status === "idle" ? <EffectsTimelineEmptyState /> : null}
        {state.status === "loading" ? <StatusMessage type="info" title={copy.loading} /> : null}
        {state.status === "error" ? <StatusMessage type="error" title={copy.errorTitle} description={copy.errors[state.error.code]} /> : null}
        {state.status === "success" ? <EffectsTimelineResult result={state.result} loadingMore={state.loadingMore} pageError={state.pageError} onLoadMore={loadMore} /> : null}
      </div>
    </Card>
  </div>;
}
