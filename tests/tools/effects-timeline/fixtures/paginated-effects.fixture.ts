export const firstPage = Array.from({ length: 20 }, (_, index) => ({
  paging_token: `${BigInt("110694007436259330") - BigInt(index)}-2`,
  type: "account_credited",
  created_at: "2026-10-20T12:00:00Z",
  amount: "1.0000000",
  asset_type: "native"
}));

export const secondPage = [
  firstPage[19],
  { ...firstPage[19], paging_token: "110694007436259310-1", amount: "0.5000000" }
];
