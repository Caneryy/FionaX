"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "@/app/tools/result-code-explainer/copy";
import { OperationTypePicker } from "@/app/tools/result-code-explainer/components/OperationTypePicker";

export function ResultCodeExplainerForm({ onSubmit }: { onSubmit: (code: string, operationType: string) => void }) {
  const [code, setCode] = useState("");
  const [operationType, setOperationType] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(code, operationType);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="result-code-input" className="text-sm font-bold text-[#4e5c73]">
          Result code
        </label>
        <Input
          id="result-code-input"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={copy.codePlaceholder}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <OperationTypePicker value={operationType} onChange={setOperationType} />
      <Button type="submit">{copy.submit}</Button>
    </form>
  );
}
