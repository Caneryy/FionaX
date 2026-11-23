"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/app/tools/memo-inspector/copy";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function MemoInspectorForm({
  onSubmit,
  loading,
  invalid
}: {
  onSubmit: (value: string) => void;
  loading: boolean;
  invalid: boolean;
}) {
  const [value, setValue] = useState("");
  const hintId = "memo-inspector-hint";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value);
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
      <label htmlFor="memo-inspector-hash" className="block space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.form.label}</span>
        <Input
          id="memo-inspector-hash"
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
      <p id={hintId} className="text-sm leading-6 text-[#68758a]">
        {copy.form.hint}
      </p>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? copy.submitting : copy.submit}
      </Button>
    </form>
  );
}
