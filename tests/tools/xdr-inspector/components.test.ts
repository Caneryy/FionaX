import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { XdrInspectorPanel } from "@/app/tools/xdr-inspector/components/XdrInspectorPanel";
import type { XdrInspectorState } from "@/app/tools/xdr-inspector/types";

const mock = vi.hoisted(() => ({ state: { status: "idle" } as XdrInspectorState }));
vi.mock("@/app/tools/xdr-inspector/hooks/useXdrInspector", () => ({
  useXdrInspector: () => ({ state: mock.state, submit: vi.fn() })
}));

function html() {
  return renderToStaticMarkup(createElement(XdrInspectorPanel));
}

describe("inspector panel states", () => {
  beforeEach(() => { mock.state = { status: "idle" }; });

  it("shows accessible input and idle guidance", () => {
    const output = html();
    expect(output).toContain('id="xdr-input"');
    expect(output).toContain("Nothing is submitted or saved.");
  });
  it("announces local loading", () => {
    mock.state = { status: "loading" };
    expect(html()).toContain('aria-busy="true"');
    expect(html()).toContain("Decoding locally");
  });
  it("shows detected type, size and nested JSON on success", () => {
    mock.state = { status: "success", result: { type: "ledger_entry", byteLength: 16, json: '{\n  "data": {"ttl": 1}\n}' } };
    const output = html();
    expect(output).toContain("Ledger entry");
    expect(output).toContain("16 bytes");
    expect(output).toContain("Decoded JSON structure");
  });
  it("shows the explicit undetected outcome", () => {
    mock.state = { status: "error", error: { code: "undetected_type" } };
    expect(html()).toContain("Could not decode as a supported XDR type");
  });
  it("shows actionable validation errors", () => {
    mock.state = { status: "error", error: { code: "invalid_xdr" } };
    expect(html()).toContain("Enter a complete, valid base64 XDR blob");
  });
});
