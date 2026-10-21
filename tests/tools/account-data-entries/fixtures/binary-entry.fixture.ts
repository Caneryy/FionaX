import { fixtureAccountId } from "./text-entries.fixture";

export const binaryEntryName = "blob";
export const binaryEntryBase64 = "//4=";
export const binaryEntryHex = "fffe";

export const binaryEntryHorizonAccount = {
  account_id: fixtureAccountId,
  data: {
    [binaryEntryName]: binaryEntryBase64
  }
};
