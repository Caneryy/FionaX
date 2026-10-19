import { claimant, issuer } from "./unconditional-balance.fixture";

export const timeBalance = {
  id: "b".repeat(72), paging_token: "0".repeat(69) + "065", asset: `USD:${issuer}`, amount: "0.0000001",
  claimants: [{ destination: claimant, predicate: { absBefore: "2030-01-01T00:00:00Z", absBeforeEpoch: "1893456000" } }]
};
export const relativePredicate = { relBefore: "3600" };
