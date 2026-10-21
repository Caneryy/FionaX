"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "../copy";

export function ClaimableBalancesForm({ onSubmit, loading }: { onSubmit: (claimant: string, cursor: string) => void; loading: boolean }) {
  const [claimant, setClaimant] = useState("");
  const [cursor, setCursor] = useState("");
  return <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(claimant, cursor); }}>
    <label className="block space-y-2"><span className="text-sm font-medium text-[#29364d]">{copy.claimantLabel}</span>
      <Input value={claimant} onChange={(event) => setClaimant(event.target.value.trimStart().toUpperCase().startsWith("S") ? "" : event.target.value)} placeholder={copy.claimantPlaceholder} autoComplete="off" spellCheck={false} required />
    </label>
    <label className="block space-y-2"><span className="text-sm font-medium text-[#29364d]">{copy.cursorLabel}</span>
      <Input value={cursor} onChange={(event) => setCursor(event.target.value.trimStart().toUpperCase().startsWith("S") ? "" : event.target.value)} placeholder={copy.cursorPlaceholder} autoComplete="off" spellCheck={false} />
    </label>
    <Button type="submit" disabled={loading}>{loading ? copy.loading : copy.submit}</Button>
  </form>;
}
