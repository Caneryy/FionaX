export const fixtureHash = "a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff00";

export const fixtureSource = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

export const textMemoTransaction = {
  hash: fixtureHash,
  memo_type: "text",
  memo: "invoice-42",
  source_account: fixtureSource,
  created_at: "2024-06-01T12:00:00Z",
  successful: true
};

export const noneMemoTransaction = {
  hash: fixtureHash,
  memo_type: "none",
  source_account: fixtureSource,
  created_at: "2024-06-01T12:00:00Z",
  successful: true
};

export const idMemoTransaction = {
  hash: fixtureHash,
  memo_type: "id",
  memo: "18446744073709551615",
  source_account: fixtureSource,
  created_at: "2024-06-01T12:00:00Z",
  successful: false
};
