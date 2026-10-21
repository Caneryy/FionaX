"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "@/app/tools/asset-statistics/copy";
import type { AssetStatisticsErrorCode, AssetStatisticsFormValues } from "@/app/tools/asset-statistics/types";

interface AssetStatisticsFormProps {
  onSubmit: (values: AssetStatisticsFormValues) => void;
  loading: boolean;
  errorCode: AssetStatisticsErrorCode | null;
}

export function AssetStatisticsForm({ onSubmit, loading, errorCode }: AssetStatisticsFormProps) {
  const [assetCode, setAssetCode] = useState("");
  const [assetIssuer, setAssetIssuer] = useState("");
  const codeInvalid = errorCode === "invalid_asset_code";
  const issuerInvalid = errorCode === "invalid_issuer";

  return (
    <form
      className="grid gap-4"
      aria-busy={loading}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ assetCode, assetIssuer });
      }}
    >
      <label className="block min-w-0 space-y-2" htmlFor="asset-statistics-code">
        <span className="text-sm font-extrabold text-[#29364d]">{copy.assetCodeLabel}</span>
        <Input
          id="asset-statistics-code"
          name="assetCode"
          value={assetCode}
          onChange={(event) => setAssetCode(event.target.value)}
          placeholder={copy.assetCodePlaceholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-invalid={codeInvalid}
          aria-describedby="asset-statistics-code-hint"
          disabled={loading}
        />
        <span id="asset-statistics-code-hint" className="block text-sm leading-6 text-[#5d6b82]">
          {copy.assetCodeHint}
        </span>
      </label>
      <label className="block min-w-0 space-y-2" htmlFor="asset-statistics-issuer">
        <span className="text-sm font-extrabold text-[#29364d]">{copy.issuerLabel}</span>
        <Input
          id="asset-statistics-issuer"
          name="assetIssuer"
          value={assetIssuer}
          onChange={(event) => setAssetIssuer(event.target.value)}
          placeholder={copy.issuerPlaceholder}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={issuerInvalid}
          aria-describedby="asset-statistics-issuer-hint"
          disabled={loading}
        />
        <span id="asset-statistics-issuer-hint" className="block text-sm leading-6 text-[#5d6b82]">
          {copy.issuerHint}
        </span>
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? copy.loadingButton : copy.submit}
        </Button>
      </div>
    </form>
  );
}
