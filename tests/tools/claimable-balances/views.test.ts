import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ClaimableBalancesEmptyState } from "@/app/tools/claimable-balances/components/ClaimableBalancesEmptyState";
import { ClaimableBalancesForm } from "@/app/tools/claimable-balances/components/ClaimableBalancesForm";
import { ClaimableBalancesResult } from "@/app/tools/claimable-balances/components/ClaimableBalancesResult";
import { copy } from "@/app/tools/claimable-balances/copy";
import type { ClaimableBalancesResult as Result } from "@/app/tools/claimable-balances/types";
import { claimant, sponsor } from "./fixtures/unconditional-balance.fixture";

const base: Result = { balances: [], pagesFetched: 1, pageLimit: 3, network: "testnet" };
describe("viewer states", () => {
  it("shows guidance before interaction and accessible controls", () => {
    expect(renderToStaticMarkup(createElement(ClaimableBalancesEmptyState))).toContain(copy.idle);
    const form = renderToStaticMarkup(createElement(ClaimableBalancesForm, { onSubmit: () => {}, loading: false }));
    expect(form).toContain(copy.claimantLabel);
    expect(form).toContain(copy.cursorLabel);
  });
  it("shows loading feedback and disables submission", () => {
    const form = renderToStaticMarkup(createElement(ClaimableBalancesForm, { onSubmit: () => {}, loading: true }));
    expect(form).toContain(copy.loading);
    expect(form).toContain("disabled");
  });
  it("shows page coverage and a dedicated empty claimant state", () => {
    const html = renderToStaticMarkup(createElement(ClaimableBalancesResult, { result: base }));
    expect(html).toContain(copy.coverage(1, 3));
    expect(html).toContain(copy.emptyTitle);
  });
  it("shows exact amount, sponsor and full nested predicate", () => {
    const result: Result = { ...base, balances: [{ id: "1", pagingToken: "1", asset: "native", amount: "123456789.0000001", sponsor,
      predicate: { kind: "and", children: [{ kind: "unconditional" }, { kind: "not", child: { kind: "rel_before", value: "3600" } }] } }] };
    const html = renderToStaticMarkup(createElement(ClaimableBalancesResult, { result }));
    for (const text of ["XLM", "123456789.0000001", sponsor, copy.and, copy.unconditional, copy.not, "3600"]) expect(html).toContain(text);
    expect(html).not.toContain(claimant);
  });
});
