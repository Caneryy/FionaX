"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { AccountMergePreflightEmptyState } from "@/app/tools/account-merge-preflight/components/AccountMergePreflightEmptyState";
import { AccountMergePreflightForm } from "@/app/tools/account-merge-preflight/components/AccountMergePreflightForm";
import { AccountMergePreflightResult } from "@/app/tools/account-merge-preflight/components/AccountMergePreflightResult";
import { copy } from "@/app/tools/account-merge-preflight/copy";
import { useAccountMergePreflight } from "@/app/tools/account-merge-preflight/hooks/useAccountMergePreflight";
import { formatNetworkName } from "@/app/tools/account-merge-preflight/lib/format";

export function AccountMergePreflightPanel() {
  const { state, submit, network } = useAccountMergePreflight();
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
        <AccountMergePreflightForm onSubmit={submit} loading={loading} invalid={state.status === "error"} />
        <div aria-live="polite" className="space-y-4">
          {state.status === "idle" ? <AccountMergePreflightEmptyState /> : null}
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
          {state.status === "success" ? <AccountMergePreflightResult result={state.result} /> : null}
        </div>
      </Card>
    </div>
  );
}
