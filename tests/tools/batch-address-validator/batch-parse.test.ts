import { describe, expect, it } from "vitest";
import { parseBatch } from "@/app/tools/batch-address-validator/lib/batch-parse";
import { publicKeyFromFixedSeed } from "@/tests/tools/batch-address-validator/fixtures/mixed-batch.fixture";

describe("parseBatch", () => {
  const alpha = publicKeyFromFixedSeed(1);
  const beta = publicKeyFromFixedSeed(2);

  it("splits new lines and keeps line numbers", () => {
    const entries = parseBatch(`${alpha}\n${beta}`);

    expect(entries).toEqual([
      { value: alpha, line: 1, index: 0 },
      { value: beta, line: 2, index: 1 }
    ]);
  });

  it("splits commas on one line", () => {
    const entries = parseBatch(`${alpha}, ${beta}`);

    expect(entries.map((entry) => entry.value)).toEqual([alpha, beta]);
    expect(entries.every((entry) => entry.line === 1)).toBe(true);
  });

  it("accepts a mix of commas and new lines and skips blank tokens", () => {
    const entries = parseBatch(`${alpha}, bad\r\n\n, ${beta},`);

    expect(entries).toEqual([
      { value: alpha, line: 1, index: 0 },
      { value: "bad", line: 1, index: 1 },
      { value: beta, line: 3, index: 2 }
    ]);
  });

  it("returns no entries for whitespace and commas", () => {
    expect(parseBatch("  \n , \t , ")).toEqual([]);
  });
});
