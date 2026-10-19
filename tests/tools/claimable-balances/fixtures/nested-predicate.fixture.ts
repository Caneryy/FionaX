import { claimant } from "./unconditional-balance.fixture";
import { relativePredicate } from "./time-predicate.fixture";

export const nestedPredicate = { and: [
  { or: [{ unconditional: true }, { absBefore: "2030-01-01T00:00:00Z", absBeforeEpoch: "1893456000" }] },
  { not: relativePredicate }
] };
export const nestedBalance = {
  id: "c".repeat(72), paging_token: "0".repeat(69) + "066", asset: "native", amount: "1.0000000",
  claimants: [{ destination: claimant, predicate: nestedPredicate }]
};
