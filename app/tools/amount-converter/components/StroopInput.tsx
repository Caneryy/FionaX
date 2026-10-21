import { copy } from "@/app/tools/amount-converter/copy";
import { Input } from "@/components/ui/Input";

export function StroopInput({
  value,
  onChange,
  invalid
}: {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
}) {
  const hintId = "amount-stroop-hint";

  return (
    <label htmlFor="amount-stroops" className="block space-y-2">
      <span className="text-sm font-medium text-[#29364d]">{copy.form.stroopLabel}</span>
      <Input
        id="amount-stroops"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={copy.form.stroopPlaceholder}
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        aria-describedby={hintId}
        aria-invalid={invalid}
      />
      <p id={hintId} className="text-sm leading-6 text-[#68758a]">{copy.form.stroopHint}</p>
    </label>
  );
}
