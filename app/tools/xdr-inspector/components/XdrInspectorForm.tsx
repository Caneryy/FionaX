"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { copy } from "../copy";
import { MAX_XDR_BYTES } from "../schema";
import { InputSizeWarning } from "./InputSizeWarning";

interface Props {
  onSubmit: (value: string) => void;
  loading: boolean;
}

export function XdrInspectorForm({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("");
  const estimatedBytes = Math.floor(value.replace(/\s/g, "").length * 3 / 4);
  const oversized = estimatedBytes > MAX_XDR_BYTES || value.length > Math.ceil(MAX_XDR_BYTES / 3) * 4 + 4096;

  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit(value); }} className="space-y-4">
      <label htmlFor="xdr-input" className="block text-sm font-semibold text-[#29364d]">{copy.inputLabel}</label>
      <textarea
        id="xdr-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={copy.inputPlaceholder}
        spellCheck={false}
        autoComplete="off"
        rows={7}
        aria-describedby={oversized ? "xdr-size-warning" : undefined}
        className="w-full rounded-md border border-[#cfe0ea] bg-white/80 px-3 py-2 font-mono text-sm text-[#172033]"
      />
      {oversized ? <InputSizeWarning /> : null}
      <Button type="submit" disabled={loading}>{loading ? copy.loading : copy.submit}</Button>
    </form>
  );
}
