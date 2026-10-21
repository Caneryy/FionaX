"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { AccountSignersEmptyState } from "@/app/tools/account-signers/components/AccountSignersEmptyState";
import { AccountSignersForm } from "@/app/tools/account-signers/components/AccountSignersForm";
import { AccountSignersResult } from "@/app/tools/account-signers/components/AccountSignersResult";
import { copy } from "@/app/tools/account-signers/copy";
import { useAccountSigners } from "@/app/tools/account-signers/hooks/useAccountSigners";
import { formatNetworkName } from "@/app/tools/account-signers/lib/format";

export function AccountSignersPanel() {
  const { state, submit, network } = useAccountSigners();
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
        <AccountSignersForm onSubmit={submit} loading={loading} invalid={state.status === "error"} />
        <div aria-live="polite" className="space-y-4">
          {state.status === "idle" ? <AccountSignersEmptyState /> : null}
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
          {state.status === "success" ? <AccountSignersResult result={state.result} /> : null}
        </div>
      </Card>
    </div>
  );
}
