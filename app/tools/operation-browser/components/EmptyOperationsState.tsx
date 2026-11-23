import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";

export function EmptyOperationsState() {
  return <StatusMessage type="info" title={copy.emptyTitle} description={copy.empty} />;
}
