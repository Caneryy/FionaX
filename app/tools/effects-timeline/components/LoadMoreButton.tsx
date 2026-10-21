import { Button } from "@/components/ui/Button";
import { copy } from "../copy";

export function LoadMoreButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return <Button type="button" variant="secondary" disabled={loading} onClick={onClick}>
    {loading ? copy.loadingMore : copy.loadMore}
  </Button>;
}
