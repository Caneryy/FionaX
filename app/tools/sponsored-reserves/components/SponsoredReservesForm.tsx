"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "../copy";

interface Props { onSubmit: (value: string) => void; loading: boolean }

export function SponsoredReservesForm({ onSubmit, loading }: Props) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const field = event.currentTarget.elements.namedItem("account-id") as HTMLInputElement;
    onSubmit(field.value);
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.inputLabel}</span>
        <Input name="account-id" placeholder={copy.inputPlaceholder} autoComplete="off" spellCheck={false}
          onInput={(event) => {
            if (event.currentTarget.value.trim().toUpperCase().startsWith("S")) event.currentTarget.value = "";
          }} />
      </label>
      <Button type="submit" disabled={loading}>{loading ? copy.loadingButton : copy.submit}</Button>
    </form>
  );
}
