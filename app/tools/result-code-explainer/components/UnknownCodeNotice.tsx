import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "@/app/tools/result-code-explainer/copy";

export function UnknownCodeNotice() {
  return <StatusMessage type="warning" title="Unrecognized code" description={copy.errors.unknown_code} />;
}
