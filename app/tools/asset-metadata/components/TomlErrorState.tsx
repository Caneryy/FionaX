import { copy } from "@/app/tools/asset-metadata/copy";
import type { AssetMetadataErrorCode } from "@/app/tools/asset-metadata/types";

interface TomlErrorStateProps {
  code: Extract<AssetMetadataErrorCode, "toml_unreachable" | "malformed_toml">;
}

export function TomlErrorState({ code }: TomlErrorStateProps) {
  const title = code === "toml_unreachable" ? copy.tomlUnreachableTitle : copy.tomlMalformedTitle;

  return (
    <div role="alert" className="space-y-2 rounded-lg border border-[#ffc3a8]/80 bg-[#fff2e9] p-4">
      <h2 className="text-sm font-extrabold text-[#9a513f]">{title}</h2>
      <p className="text-sm leading-6 text-[#4e5c73]">{copy.errors[code]}</p>
    </div>
  );
}
