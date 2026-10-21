"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "@/app/tools/reserve-calculator/copy";

export function ReserveCalculatorForm({ onSubmit, loading }: { onSubmit: (value: string) => void; loading: boolean }) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
      className="space-y-4"
    >
      <label htmlFor="reserve-account-id" className="text-sm font-bold text-[#4e5c73]">
        Account ID
      </label>
      <Input
        id="reserve-account-id"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={copy.placeholder}
        autoComplete="off"
        spellCheck={false}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Working..." : copy.submit}
      </Button>
    </form>
  );
}
