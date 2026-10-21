"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { isRejectedSecret } from "@/app/tools/asset-flags-inspector/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AssetFlagsInspectorFormProps {
  onSubmit: (value: string) => void;
  loading: boolean;
  invalid: boolean;
}

export function AssetFlagsInspectorForm({ onSubmit, loading, invalid }: AssetFlagsInspectorFormProps) {
  const [value, setValue] = useState("");
  const hintId = "issuer-account-hint";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitted = value;

    // Drop a seed from the field after submit so the page does not keep showing it.
    if (isRejectedSecret(submitted.trim())) {
      setValue("");
    }

    onSubmit(submitted);
  }

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-busy={loading}
    >
      <label htmlFor="issuer-account-id" className="block space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.form.label}</span>
        <Input
          id="issuer-account-id"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={copy.form.placeholder}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
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
