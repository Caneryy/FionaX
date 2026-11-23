import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";

export function IncompleteDataNotice() {
  return (
    <StatusMessage type="warning" title={copy.incompleteTitle} description={copy.incompleteBody} />
  );
}
