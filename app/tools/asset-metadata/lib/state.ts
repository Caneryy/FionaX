import type {
  AssetMetadataError,
  AssetMetadataErrorCode,
  AssetMetadataResult,
  AssetMetadataViewState
} from "@/app/tools/asset-metadata/types";

export type AssetMetadataPanelSection = "idle" | "loading" | "success" | "toml-error" | "error";

export type AssetMetadataAction =
  | { type: "reset" }
  | { type: "submit" }
  | { type: "succeed"; result: AssetMetadataResult }
  | { type: "fail"; error: AssetMetadataError };

export function reduceAssetMetadataState(
  state: AssetMetadataViewState,
  action: AssetMetadataAction
): AssetMetadataViewState {
  switch (action.type) {
    case "reset":
      return { status: "idle" };
    case "submit":
      return { status: "loading" };
    case "succeed":
      return { status: "success", result: action.result };
    case "fail":
      return { status: "error", error: action.error };
    default:
      return state;
  }
}

export function isTomlDocumentError(code: AssetMetadataErrorCode): code is "toml_unreachable" | "malformed_toml" {
  return code === "toml_unreachable" || code === "malformed_toml";
}

// A missing home_domain stays on the generic error path. Unreachable and malformed toml use their own view.
export function panelSection(state: AssetMetadataViewState): AssetMetadataPanelSection {
  if (state.status === "idle" || state.status === "loading" || state.status === "success") {
    return state.status;
  }
  return isTomlDocumentError(state.error.code) ? "toml-error" : "error";
}
