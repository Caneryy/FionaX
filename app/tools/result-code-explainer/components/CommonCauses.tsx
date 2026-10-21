import { copy } from "@/app/tools/result-code-explainer/copy";

export function CommonCauses({ causes }: { causes: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-[#4e5c73]">{copy.commonCausesTitle}</h3>
      {causes.length === 0 ? (
        <p className="text-sm text-[#68758a]">{copy.noCommonCauses}</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-sm text-[#172033]">
          {causes.map((cause) => (
            <li key={cause}>{cause}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
