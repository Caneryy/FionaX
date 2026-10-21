import { copy } from "@/app/tools/amount-converter/copy";
import { Input } from "@/components/ui/Input";

export function DecimalInput({
  value,
  onChange,
  invalid
}: {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
}) {
  const hintId = "amount-decimal-hint";

  return (
    <label htmlFor="amount-decimal" className="block space-y-2">
      <span className="text-sm font-medium text-[#29364d]">{copy.form.decimalLabel}</span>
      <Input
        id="amount-decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={copy.form.decimalPlaceholder}
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        aria-describedby={hintId}
        aria-invalid={invalid}
      />
      <p id={hintId} className="text-sm leading-6 text-[#68758a]">{copy.form.decimalHint}</p>
    </label>
  );
}
