"use client";

import { Button } from "@/components/ui/Button";
import { copy } from "@/app/tools/batch-address-validator/copy";

interface BatchAddressValidatorFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  loading: boolean;
}

export function BatchAddressValidatorForm({ value, onChange, onSubmit, loading }: BatchAddressValidatorFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
      className="space-y-4"
    >
      <label htmlFor="batch-address-list" className="block space-y-2">
        <span className="text-sm font-extrabold text-[#172033]">{copy.formLabel}</span>
        <textarea
          id="batch-address-list"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={copy.placeholder}
          rows={8}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          disabled={loading}
          aria-describedby="batch-address-hint"
          aria-busy={loading}
          className="min-h-40 w-full resize-y rounded-md border border-[#c7d6e8] bg-white/78 px-3 py-3 font-mono text-base text-[#172033] outline-none transition placeholder:text-[#8a98aa] focus:border-[#47a8c7] focus:ring-2 focus:ring-[#8edcf4]/35 disabled:opacity-60 sm:text-sm"
        />
      </label>
      <p id="batch-address-hint" className="text-sm leading-6 text-[#5d6b82]">
        {copy.formHint}
      </p>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? copy.submitting : copy.submit}
      </Button>
    </form>
  );
}
