"use client";

import { useState } from "react";
import { runBatchAddressValidator } from "@/app/tools/batch-address-validator/lib/batchAddressValidator";
import { toToolError } from "@/app/tools/batch-address-validator/lib/batchAddressValidator.errors";
import { validateBatchAddressValidatorInput } from "@/app/tools/batch-address-validator/schema";
import type {
  BatchAddressValidatorError,
  BatchAddressValidatorResult
} from "@/app/tools/batch-address-validator/types";

export type BatchAddressValidatorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: BatchAddressValidatorResult }
  | { status: "error"; error: BatchAddressValidatorError };

export function useBatchAddressValidator() {
  const [state, setState] = useState<BatchAddressValidatorState>({ status: "idle" });

  async function submit(raw: string) {
    const parsed = validateBatchAddressValidatorInput(raw);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    setState({ status: "loading" });
    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
      const result = runBatchAddressValidator(parsed.input);
      setState({ status: "success", result });
    } catch (error) {
      setState({ status: "error", error: toToolError(error) });
    }
  }

  return { state, submit };
}
