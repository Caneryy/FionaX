import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "@/app/tools/preconditions-explainer/copy";

export function UnrestrictedNotice() {
  return <StatusMessage type="info" title={copy.unrestrictedTitle} description={copy.unrestrictedDescription} />;
}
