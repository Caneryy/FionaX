"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "../copy";

interface Props {
  onSubmit: (poolId: string) => void;
  loading: boolean;
}

export function LiquidityPoolInspectorForm({ onSubmit, loading }: Props) {
  const [poolId, setPoolId] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(poolId);
      }}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.poolIdLabel}</span>
        <Input
          value={poolId}
          onChange={(event) => {
            const next = event.target.value;
            // Block secret seed prefixes without accepting them into state.
            if (next.trimStart().toUpperCase().startsWith("S")) return;
            setPoolId(next);
          }}
          placeholder={copy.poolIdPlaceholder}
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          aria-describedby="pool-id-hint"
          required
        />
        <span id="pool-id-hint" className="block text-xs text-[#68758a]">
          {copy.idle}
        </span>
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? copy.loading : copy.submit}
      </Button>
    </form>
  );
}
