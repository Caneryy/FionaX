import { fixtureAccountId } from "./text-entries.fixture";

export const emptyEntriesHorizonAccount = {
  account_id: fixtureAccountId,
  data: {}
};

export const accountNotFoundBody = {
  type: "https://stellar.org/horizon-errors/not_found",
  title: "Resource Missing"
};
