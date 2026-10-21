"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/app/tools/account-signers/copy";
import { isRejectedSecret } from "@/app/tools/account-signers/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AccountSignersForm({
  onSubmit,
  loading,
  invalid
}: {
  onSubmit: (value: string) => void;
  loading: boolean;
  invalid: boolean;
}) {
  const [value, setValue] = useState("");
  const hintId = "account-signers-hint";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitted = value;
    if (isRejectedSecret(submitted.trim())) setValue("");
    onSubmit(submitted);
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
      <label htmlFor="account-signers-id" className="block space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.form.label}</span>
        <Input
          id="account-signers-id"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={copy.form.placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={hintId}
          aria-invalid={invalid}
          disabled={loading}
        />
      </label>
      <p id={hintId} className="text-sm leading-6 text-[#68758a]">{copy.form.hint}</p>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? copy.submitting : copy.submit}
      </Button>
    </form>
  );
}
