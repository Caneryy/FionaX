import type { ResultCodeExplainerResult as Result } from "@/app/tools/result-code-explainer/types";
import { CodeExplanation } from "@/app/tools/result-code-explainer/components/CodeExplanation";
import { CommonCauses } from "@/app/tools/result-code-explainer/components/CommonCauses";

export function ResultCodeExplainerResult({ result }: { result: Result }) {
  return (
    <div className="space-y-4">
      <CodeExplanation result={result} />
      <CommonCauses causes={result.commonCauses} />
    </div>
  );
}
