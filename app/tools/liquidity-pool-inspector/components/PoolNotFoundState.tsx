import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";

export function PoolNotFoundState() {
  return <StatusMessage type="error" title={copy.notFoundTitle} description={copy.notFoundBody} />;
}
