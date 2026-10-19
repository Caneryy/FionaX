import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";

export function UndetectedNotice() {
  return <StatusMessage type="warning" title={copy.undetectedTitle} description={copy.errors.undetected_type} />;
}
