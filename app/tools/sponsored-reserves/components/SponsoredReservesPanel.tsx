"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useNetwork } from "@/components/stellar/NetworkProvider";
import { copy } from "../copy";
import { useSponsoredReserves } from "../hooks/useSponsoredReserves";
import type { SponsoredReservesState } from "../types";
import { SponsoredReservesEmptyState } from "./SponsoredReservesEmptyState";
import { SponsoredReservesForm } from "./SponsoredReservesForm";
import { SponsoredReservesResult } from "./SponsoredReservesResult";

export function SponsoredReservesPanel() {
  const { network } = useNetwork();
  const { state, submit } = useSponsoredReserves(network);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="star" eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Card className="space-y-5">
        <SponsoredReservesForm onSubmit={submit} loading={state.status === "loading"} />
        <SponsoredReservesFeedback state={state} />
      </Card>
    </div>
  );
}

export function SponsoredReservesFeedback({ state }: { state: SponsoredReservesState }) {
  return (
    <div aria-live="polite">
      {state.status === "idle" ? <SponsoredReservesEmptyState /> : null}
      {state.status === "loading" ? <p className="text-sm">{copy.loading}</p> : null}
      {state.status === "error" ? <StatusMessage type="error" title={copy.errorTitle} description={copy.errors[state.error.code]} /> : null}
      {state.status === "success" ? <SponsoredReservesResult result={state.result} /> : null}
    </div>
  );
}
