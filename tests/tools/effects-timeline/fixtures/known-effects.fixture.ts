export const accountId = "GCNL55IJTH2HX26HLNIGYD2JIQLTBAQL3SVPNZA6PXK7NAVHU423WOTE";

export const knownEffects = [
  {
    paging_token: "110694007436259330-2",
    type: "account_credited",
    created_at: "2026-10-20T12:00:00Z",
    asset_type: "native",
    amount: "0.0000001",
    _links: { self: { href: "https://example.test/effect" } }
  },
  {
    paging_token: "110694007436259329-1",
    type: "trustline_created",
    created_at: "2026-10-19T12:00:00Z",
    asset_type: "credit_alphanum4",
    asset_code: "USD"
  }
];

export const pageOf = (records: unknown[]) => ({ _embedded: { records } });
