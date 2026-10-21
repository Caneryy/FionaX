import {
  mixedBatchKeys,
  publicKeyFromFixedSeed
} from "@/tests/tools/batch-address-validator/fixtures/mixed-batch.fixture";

export const duplicateBatchKeys = {
  alpha: mixedBatchKeys.alpha,
  beta: mixedBatchKeys.beta,
  gamma: publicKeyFromFixedSeed(3)
};

export const duplicateBatchRaw = [
  `${duplicateBatchKeys.alpha},${duplicateBatchKeys.beta},${duplicateBatchKeys.alpha}`,
  "not-a-stellar-address",
  duplicateBatchKeys.beta
].join("\n");
