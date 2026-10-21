"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "@/app/tools/asset-metadata/copy";

interface AssetMetadataFormProps {
  onSubmit: (issuerAccountId: string, assetCode: string) => void;
  loading: boolean;
  networkLabel: string;
}

export function AssetMetadataForm({ onSubmit, loading, networkLabel }: AssetMetadataFormProps) {
  const [issuerAccountId, setIssuerAccountId] = useState("");
  const [assetCode, setAssetCode] = useState("");

  return (
    <form
      className="grid grid-cols-1 gap-4"
      aria-busy={loading}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(issuerAccountId, assetCode);
      }}
    >
      <label htmlFor="asset-metadata-issuer" className="block min-w-0 space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.issuerLabel}</span>
        <Input
          id="asset-metadata-issuer"
          name="issuerAccountId"
          value={issuerAccountId}
          onChange={(event) => setIssuerAccountId(event.target.value)}
          placeholder={copy.issuerPlaceholder}
          autoComplete="off"
          spellCheck={false}
          aria-describedby="asset-metadata-issuer-hint"
          disabled={loading}
        />
        <span id="asset-metadata-issuer-hint" className="block text-xs leading-5 text-[#68758a]">
          {copy.issuerHint}
        </span>
      </label>
      <label htmlFor="asset-metadata-code" className="block min-w-0 space-y-2">
        <span className="text-sm font-medium text-[#29364d]">{copy.assetCodeLabel}</span>
        <Input
          id="asset-metadata-code"
          name="assetCode"
          value={assetCode}
          onChange={(event) => setAssetCode(event.target.value)}
          placeholder={copy.assetCodePlaceholder}
          autoComplete="off"
          spellCheck={false}
          aria-describedby="asset-metadata-code-hint"
          disabled={loading}
        />
        <span id="asset-metadata-code-hint" className="block text-xs leading-5 text-[#68758a]">
          {copy.assetCodeHint}
        </span>
      </label>
      <p className="text-xs leading-5 text-[#68758a]">{copy.networkHint(networkLabel)}</p>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? copy.submitting : copy.submit}
      </Button>
    </form>
  );
}
