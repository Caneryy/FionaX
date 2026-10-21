import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/asset-statistics/copy";
import { toToolError } from "@/app/tools/asset-statistics/lib/assetStatistics.errors";

describe("toToolError", () => {
  it("maps HTTP 429 to rate_limited", () => {
    const error = toToolError({ response: { status: 429 } });
    expect(error).toEqual({ code: "rate_limited", message: copy.errors.rate_limited });
  });

  it("maps HTTP 404 to asset_not_found", () => {
    expect(toToolError({ status: 404 }).code).toBe("asset_not_found");
  });

  it("maps network and decode failures to request_failed without echoing the thrown text", () => {
    const secret = "SA secret that must stay out of the message";
    const error = toToolError(new Error(secret));
    expect(error.code).toBe("request_failed");
    expect(error.message).toBe(copy.errors.request_failed);
    expect(error.message.includes(secret)).toBe(false);
  });

  it("keeps an already classified code and replaces any attached message", () => {
    const error = toToolError({ code: "invalid_issuer", message: "SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" });
    expect(error).toEqual({ code: "invalid_issuer", message: copy.errors.invalid_issuer });
  });

  it("maps unknown values to request_failed", () => {
    expect(toToolError("nope").code).toBe("request_failed");
    expect(toToolError(null).code).toBe("request_failed");
  });
});
