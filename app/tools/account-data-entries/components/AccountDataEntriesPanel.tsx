"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { AccountDataEntriesEmptyState } from "@/app/tools/account-data-entries/components/AccountDataEntriesEmptyState";
import { AccountDataEntriesForm } from "@/app/tools/account-data-entries/components/AccountDataEntriesForm";
import { AccountDataEntriesResult } from "@/app/tools/account-data-entries/components/AccountDataEntriesResult";
import { copy } from "@/app/tools/account-data-entries/copy";
import { useAccountDataEntries } from "@/app/tools/account-data-entries/hooks/useAccountDataEntries";
import { formatNetworkName } from "@/app/tools/account-data-entries/lib/format";

export function AccountDataEntriesPanel() {
  const { state, submit, network } = useAccountDataEntries();
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
        <AccountDataEntriesForm onSubmit={submit} loading={loading} invalid={state.status === "error"} />
        <div aria-live="polite" className="space-y-4">
          {state.status === "idle" ? <AccountDataEntriesEmptyState /> : null}
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
          {state.status === "success" ? <AccountDataEntriesResult result={state.result} /> : null}
        </div>
      </Card>
    </div>
  );
}
