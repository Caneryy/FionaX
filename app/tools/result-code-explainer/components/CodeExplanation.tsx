import { Badge } from "@/components/ui/Badge";
import { formatCategory } from "@/app/tools/result-code-explainer/lib/format";
import type { ResultCodeExplainerResult } from "@/app/tools/result-code-explainer/types";

export function CodeExplanation({ result }: { result: ResultCodeExplainerResult }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="info">{formatCategory(result.category)}</Badge>
        {result.operationType ? <Badge tone="muted">{result.operationType}</Badge> : null}
        <span className="font-mono text-xs text-[#4e5c73]">{result.code}</span>
      </div>
      <p className="text-sm font-extrabold text-[#172033]">{result.label}</p>
      <p className="text-sm text-[#172033]">{result.explanation}</p>
    </div>
  );
}
