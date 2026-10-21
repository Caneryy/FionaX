"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/app/tools/account-data-entries/copy";
import { isRejectedSecret } from "@/app/tools/account-data-entries/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AccountDataEntriesFormProps {
  onSubmit: (value: string) => void;
  loading: boolean;
  invalid: boolean;
}

export function AccountDataEntriesForm({ onSubmit, loading, invalid }: AccountDataEntriesFormProps) {
  const [value, setValue] = useState("");
  const hintId = "account-data-entries-hint";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitted = value;

    if (isRejectedSecret(submitted.trim())) {
      setValue("");
    }

    onSubmit(submitted);
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
      <label htmlFor="account-data-entries-id" className="block space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.form.label}</span>
        <Input
          id="account-data-entries-id"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={copy.form.placeholder}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
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
