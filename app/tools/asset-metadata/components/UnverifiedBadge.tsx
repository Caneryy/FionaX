import { Badge } from "@/components/ui/Badge";
import { copy } from "@/app/tools/asset-metadata/copy";

export function UnverifiedBadge() {
  return (
    <div className="space-y-2">
      <Badge tone="warning">{copy.unverifiedBadge}</Badge>
      <p className="text-sm leading-6 text-[#5d6b82]">{copy.unverifiedDetail}</p>
    </div>
  );
}
