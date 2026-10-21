import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "@/app/tools/batch-address-validator/copy";

export function SecretSeedWarning() {
  return (
    <StatusMessage type="warning" title={copy.secretWarningTitle} description={copy.errors.contains_secret_seed} />
  );
}
