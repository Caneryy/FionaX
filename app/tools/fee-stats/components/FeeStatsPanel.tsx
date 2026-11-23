"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useNetwork } from "@/components/stellar/NetworkProvider";
import { copy } from "../copy";
import { useFeeStats } from "../hooks/useFeeStats";
import { FeeStatsEmptyState } from "./FeeStatsEmptyState";
import { FeeStatsForm } from "./FeeStatsForm";
import { FeeStatsResult } from "./FeeStatsResult";

export function FeeStatsPanel() {
  const { network } = useNetwork();
  return <FeeStatsContent key={network} network={network} />;
}

function FeeStatsContent({ network }: { network: "testnet" | "mainnet" }) {
  const { state, refresh } = useFeeStats(network);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="star" eyebrow={network} title={copy.title} description={copy.intro} />
      <Card className="space-y-5">
        <FeeStatsForm
          onSubmit={refresh}
          loading={state.status === "loading"}
          hasResult={state.status === "success"}
        />
        <div aria-live="polite">
          {state.status === "idle" ? <FeeStatsEmptyState /> : null}
          {state.status === "loading" ? <p className="text-sm text-[#68758a]">{copy.loading}</p> : null}
          {state.status === "error" ? (
            <StatusMessage type="error" title={copy.errorTitle} description={copy.errors[state.error.code]} />
          ) : null}
          {state.status === "success" ? <FeeStatsResult result={state.result} /> : null}
        </div>
      </Card>
    </div>
  );
}
