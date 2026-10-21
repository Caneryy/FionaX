"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { BatchAddressValidatorEmptyState } from "@/app/tools/batch-address-validator/components/BatchAddressValidatorEmptyState";
import { BatchAddressValidatorForm } from "@/app/tools/batch-address-validator/components/BatchAddressValidatorForm";
import { BatchAddressValidatorResult } from "@/app/tools/batch-address-validator/components/BatchAddressValidatorResult";
import { SecretSeedWarning } from "@/app/tools/batch-address-validator/components/SecretSeedWarning";
import { copy } from "@/app/tools/batch-address-validator/copy";
import { useBatchAddressValidator } from "@/app/tools/batch-address-validator/hooks/useBatchAddressValidator";
import { parseBatch } from "@/app/tools/batch-address-validator/lib/batch-parse";
import { batchContainsSecretSeed } from "@/app/tools/batch-address-validator/lib/secret-seed-guard";

export function BatchAddressValidatorPanel() {
  const { state, submit } = useBatchAddressValidator();
  const [draft, setDraft] = useState("");
  const loading = state.status === "loading";

  function handleSubmit(value: string) {
    const entries = parseBatch(value);
    if (batchContainsSecretSeed(entries)) {
      setDraft("");
    }
    void submit(value);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <CharacterPanel
        tone="star"
        eyebrow={copy.characterEyebrow}
        title={copy.title}
        description={copy.idle}
      />
      <Card className="space-y-5">
        <BatchAddressValidatorForm value={draft} onChange={setDraft} onSubmit={handleSubmit} loading={loading} />
        <div aria-live="polite" className="space-y-4" data-state={state.status}>
          {state.status === "idle" ? <BatchAddressValidatorEmptyState /> : null}
          {state.status === "loading" ? (
            <StatusMessage type="info" title={copy.processingTitle} description={copy.processingDescription} />
          ) : null}
          {state.status === "error" && state.error.code === "empty_batch" ? (
            <BatchAddressValidatorEmptyState submitted />
          ) : null}
          {state.status === "error" && state.error.code === "contains_secret_seed" ? <SecretSeedWarning /> : null}
          {state.status === "error" && state.error.code === "too_many_entries" ? (
            <StatusMessage type="error" title={copy.errorTitle} description={copy.errors.too_many_entries} />
          ) : null}
          {state.status === "success" ? <BatchAddressValidatorResult result={state.result} /> : null}
        </div>
      </Card>
    </div>
  );
}
