"use client";

import { useNetwork } from "@/components/stellar/NetworkProvider";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import { Card } from "@/components/ui/Card";
import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";
import { useOperationBrowser } from "../hooks/useOperationBrowser";
import { OperationBrowserEmptyState } from "./OperationBrowserEmptyState";
import { OperationBrowserForm } from "./OperationBrowserForm";
import { OperationBrowserResult } from "./OperationBrowserResult";

export function OperationBrowserPanel() {
  const { network } = useNetwork();
  return <OperationBrowserContent key={network} network={network} />;
}

function OperationBrowserContent({ network }: { network: StellarNetwork }) {
  const { state, submit, loadMore } = useOperationBrowser(network);
  return <div className="mx-auto max-w-3xl space-y-6">
    <CharacterPanel tone="detective" eyebrow={copy.eyebrow} title={copy.title} description={copy.intro} />
    <Card className="space-y-5">
      <OperationBrowserForm onSubmit={submit} loading={state.status === "loading"} />
      <div aria-live="polite">
        {state.status === "idle" ? <OperationBrowserEmptyState /> : null}
        {state.status === "loading" ? <StatusMessage type="info" title={copy.loading} /> : null}
        {state.status === "error" ? <StatusMessage type="error" title={copy.errorTitle} description={copy.errors[state.error.code]} /> : null}
        {state.status === "success" ? <OperationBrowserResult result={state.result} loadingMore={state.loadingMore} pageError={state.pageError} onLoadMore={loadMore} /> : null}
      </div>
    </Card>
  </div>;
}
