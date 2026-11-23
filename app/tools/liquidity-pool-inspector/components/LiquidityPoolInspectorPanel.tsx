"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useNetwork } from "@/components/stellar/NetworkProvider";
import { copy } from "../copy";
import { useLiquidityPoolInspector } from "../hooks/useLiquidityPoolInspector";
import type { LiquidityPoolInspectorState } from "../types";
import { LiquidityPoolInspectorEmptyState } from "./LiquidityPoolInspectorEmptyState";
import { LiquidityPoolInspectorForm } from "./LiquidityPoolInspectorForm";
import { LiquidityPoolInspectorResult } from "./LiquidityPoolInspectorResult";
import { PoolNotFoundState } from "./PoolNotFoundState";

export function LiquidityPoolInspectorPanel() {
  const { network } = useNetwork();
  return <LiquidityPoolInspectorContent key={network} network={network} />;
}

function LiquidityPoolInspectorContent({ network }: { network: "testnet" | "mainnet" }) {
  const { state, submit } = useLiquidityPoolInspector(network);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="star" eyebrow={`${copy.eyebrow} · ${network}`} title={copy.title} description={copy.intro} />
      <Card className="space-y-5">
        <LiquidityPoolInspectorForm onSubmit={submit} loading={state.status === "loading"} />
        <LiquidityPoolInspectorFeedback state={state} />
      </Card>
    </div>
  );
}

export function LiquidityPoolInspectorFeedback({ state }: { state: LiquidityPoolInspectorState }) {
  return (
    <div aria-live="polite" className="space-y-4">
      {state.status === "idle" ? <LiquidityPoolInspectorEmptyState /> : null}
      {state.status === "loading" ? <p className="text-sm text-[#68758a]">{copy.loading}</p> : null}
      {state.status === "error" && state.error.code === "pool_not_found" ? <PoolNotFoundState /> : null}
      {state.status === "error" && state.error.code !== "pool_not_found" ? (
        <StatusMessage type="error" title={copy.errorTitle} description={copy.errors[state.error.code]} />
      ) : null}
      {state.status === "success" ? <LiquidityPoolInspectorResult result={state.result} /> : null}
    </div>
  );
}
