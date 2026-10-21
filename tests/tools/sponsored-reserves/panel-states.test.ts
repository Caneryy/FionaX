import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SponsoredReservesFeedback } from "@/app/tools/sponsored-reserves/components/SponsoredReservesPanel";
import { copy } from "@/app/tools/sponsored-reserves/copy";
import { extractSponsorshipFields } from "@/app/tools/sponsored-reserves/lib/sponsorship-fields";
import { splitSponsorDirections } from "@/app/tools/sponsored-reserves/lib/sponsor-direction";
import type { SponsoredReservesState } from "@/app/tools/sponsored-reserves/types";
import { viewedAccount, sponsorRoleAccount } from "./fixtures/sponsor-role.fixture";

function render(state: SponsoredReservesState) {
  return renderToStaticMarkup(createElement(SponsoredReservesFeedback, { state }));
}

describe("sponsored reserves feedback", () => {
  it("gives guidance before a lookup", () => {
    expect(render({ status: "idle" })).toContain(copy.idle);
  });
  it("announces loading", () => {
    expect(render({ status: "loading" })).toContain(copy.loading);
  });
  it("shows actionable errors", () => {
    expect(render({ status: "error", error: { code: "rate_limited" } })).toContain(copy.errors.rate_limited);
  });
  it("renders a successful overview", () => {
    const result = splitSponsorDirections(extractSponsorshipFields(sponsorRoleAccount, viewedAccount), "testnet");
    expect(render({ status: "success", result })).toContain(copy.byMe);
  });
});
