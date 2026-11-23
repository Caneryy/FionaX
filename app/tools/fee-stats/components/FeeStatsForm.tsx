"use client";

import { Button } from "@/components/ui/Button";
import { copy } from "../copy";

interface Props {
  onSubmit: () => void;
  loading: boolean;
  hasResult: boolean;
}

export function FeeStatsForm({ onSubmit, loading, hasResult }: Props) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <p className="text-sm text-[#68758a]">{copy.intro}</p>
      <Button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? copy.loading : hasResult ? copy.refresh : copy.submit}
      </Button>
    </form>
  );
}
