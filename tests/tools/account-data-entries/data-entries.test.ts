import { describe, expect, it } from "vitest";
import { DataEntriesFailure, parseDataEntries } from "@/app/tools/account-data-entries/lib/data-entries";
import { binaryEntryHorizonAccount, binaryEntryName } from "./fixtures/binary-entry.fixture";
import { emptyEntriesHorizonAccount } from "./fixtures/empty-entries.fixture";
import { fixtureAccountId, nearLimitName, textEntriesHorizonAccount, textEntryName } from "./fixtures/text-entries.fixture";

describe("parseDataEntries", () => {
  it("returns text entries sorted by name", () => {
    const entries = parseDataEntries(textEntriesHorizonAccount, fixtureAccountId);
    const names = entries.map((entry) => entry.name);

    expect(names).toEqual([...names].sort());
    expect(entries.find((entry) => entry.name === textEntryName)?.text).toBe("hello");
    expect(entries.find((entry) => entry.name === nearLimitName)?.nearLimit).toBe(true);
  });

  it("keeps a binary value as a successful entry", () => {
    const entries = parseDataEntries(binaryEntryHorizonAccount, fixtureAccountId);

    expect(entries).toHaveLength(1);
    expect(entries[0]?.name).toBe(binaryEntryName);
    expect(entries[0]?.encoding).toBe("binary");
    expect(entries[0]?.text).toBeNull();
  });

  it("returns an empty list for an account with no data entries", () => {
    expect(parseDataEntries(emptyEntriesHorizonAccount, fixtureAccountId)).toEqual([]);
  });

  it("throws malformed_data_entry when a value is not base64", () => {
    expect(() =>
      parseDataEntries(
        { account_id: fixtureAccountId, data: { broken: "%%%" } },
        fixtureAccountId
      )
    ).toThrow(DataEntriesFailure);
  });
});
