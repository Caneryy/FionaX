export const firstPage = Array.from({ length: 20 }, (_, index) => ({
  paging_token: `${BigInt("110694007436259330") - BigInt(index)}`,
  type: "payment",
  created_at: "2026-10-20T12:00:00Z",
  transaction_hash: `${(index + 1).toString(16).padStart(64, "0")}`,
  amount: "1.0000000",
  asset_type: "native"
}));

export const secondPage = [
  firstPage[19],
  {
    ...firstPage[19],
    paging_token: "110694007436259310",
    transaction_hash: "d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef123456",
    amount: "0.5000000"
  }
];
