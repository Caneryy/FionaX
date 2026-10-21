"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { copy } from "@/app/tools/preconditions-explainer/copy";

export function PreconditionsExplainerForm({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
      className="space-y-4"
    >
      <label htmlFor="preconditions-envelope" className="text-sm font-bold text-[#4e5c73]">
        Transaction envelope (base64 XDR)
      </label>
      <textarea
        id="preconditions-envelope"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="min-h-32 w-full rounded-md border border-[#cfe0ea] bg-white/80 px-3 py-2 text-sm"
        placeholder={copy.placeholder}
        spellCheck={false}
        autoComplete="off"
      />
      <Button type="submit">{copy.submit}</Button>
    </form>
  );
}
