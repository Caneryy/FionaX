"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "../copy";

interface Props {
  onSubmit: (account: string) => void;
  loading: boolean;
}

export function EffectsTimelineForm({ onSubmit, loading }: Props) {
  const [account, setAccount] = useState("");
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit(account); }} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.accountLabel}</span>
        <Input
          value={account}
          onChange={(event) => {
            const value = event.target.value;
            // Public account IDs begin with G. Never retain a pasted seed in state.
            if (value.trimStart().toUpperCase().startsWith("S")) {
              setAccount("");
              onSubmit("");
            } else {
              setAccount(value);
            }
          }}
          placeholder={copy.accountPlaceholder}
          autoComplete="off"
          spellCheck={false}
          aria-required="true"
        />
      </label>
      <Button type="submit" disabled={loading}>{loading ? copy.loading : copy.submit}</Button>
    </form>
  );
}
