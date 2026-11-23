export const accountId = "GCNL55IJTH2HX26HLNIGYD2JIQLTBAQL3SVPNZA6PXK7NAVHU423WOTE";

export const knownOperations = [
  {
    paging_token: "110694007436259330",
    type: "payment",
    created_at: "2026-10-20T12:00:00Z",
    transaction_hash: "a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef",
    asset_type: "native",
    amount: "0.0000001",
    destination: "GDQNY3PBOJOKYZSRMK2S7LHHGWZIUISD4QORETLMXEWXBI7KFZZMKTL3",
    _links: { self: { href: "https://example.test/operation" } }
  },
  {
    paging_token: "110694007436259329",
    type: "change_trust",
    created_at: "2026-10-19T12:00:00Z",
    transaction_hash: "b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef12",
    asset_type: "credit_alphanum4",
    asset_code: "USD",
    limit: "1000.0000000"
  }
];

export const pageOf = (records: unknown[]) => ({ _embedded: { records } });
