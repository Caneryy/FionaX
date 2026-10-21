"use client";

import { Input } from "@/components/ui/Input";
import { copy } from "@/app/tools/result-code-explainer/copy";

export function OperationTypePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor="result-code-operation-type" className="text-sm font-bold text-[#4e5c73]">
        Operation type (optional)
      </label>
      <Input
        id="result-code-operation-type"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={copy.operationTypePlaceholder}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
