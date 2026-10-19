"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useNetwork } from "@/components/stellar/NetworkProvider";
import { copy } from "../copy";
import { useClaimableBalances } from "../hooks/useClaimableBalances";
import { ClaimableBalancesForm } from "./ClaimableBalancesForm";
import { ClaimableBalancesResult } from "./ClaimableBalancesResult";
import { ClaimableBalancesEmptyState } from "./ClaimableBalancesEmptyState";

export function ClaimableBalancesPanel() {
  const { network } = useNetwork();
  return <ClaimableBalancesContent key={network} network={network} />;
}

function ClaimableBalancesContent({ network }: { network: "testnet" | "mainnet" }) {
  const { state, submit } = useClaimableBalances(network);
  return <div className="mx-auto max-w-3xl space-y-6">
    <CharacterPanel tone="star" eyebrow={network} title={copy.title} description={copy.intro} />
    <Card className="space-y-5">
      <ClaimableBalancesForm onSubmit={submit} loading={state.status === "loading"} />
      <div aria-live="polite">
        {state.status === "idle" ? <ClaimableBalancesEmptyState /> : null}
        {state.status === "loading" ? <p className="text-sm">{copy.loading}</p> : null}
        {state.status === "error" ? <StatusMessage type="error" title={copy.errorTitle} description={copy.errors[state.error.code]} /> : null}
        {state.status === "success" ? <ClaimableBalancesResult result={state.result} /> : null}
      </div>
    </Card>
  </div>;
}
