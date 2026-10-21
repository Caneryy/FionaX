"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/app/tools/account-merge-preflight/copy";
import { isRejectedSecret } from "@/app/tools/account-merge-preflight/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AccountMergePreflightFormProps {
  onSubmit: (source: string, destination: string) => void;
  loading: boolean;
  invalid: boolean;
}

export function AccountMergePreflightForm({ onSubmit, loading, invalid }: AccountMergePreflightFormProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const hintId = "account-merge-preflight-hint";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isRejectedSecret(source.trim())) setSource("");
    if (isRejectedSecret(destination.trim())) setDestination("");

    onSubmit(source, destination);
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
      <label htmlFor="merge-source-id" className="block space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.form.sourceLabel}</span>
        <Input
          id="merge-source-id"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder={copy.form.placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={hintId}
          aria-invalid={invalid}
          disabled={loading}
        />
      </label>
      <label htmlFor="merge-destination-id" className="block space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.form.destinationLabel}</span>
        <Input
          id="merge-destination-id"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder={copy.form.placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={hintId}
          aria-invalid={invalid}
          disabled={loading}
        />
      </label>
      <p id={hintId} className="text-sm leading-6 text-[#68758a]">
        {copy.form.hint}
      </p>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? copy.submitting : copy.submit}
      </Button>
    </form>
  );
}
