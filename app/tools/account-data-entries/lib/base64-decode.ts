const PRINTABLE_CONTROLS = new Set([0x09, 0x0a, 0x0d]);

export type DecodedDataValue =
  | { ok: true; bytes: Uint8Array; encoding: "text"; text: string; hex: string }
  | { ok: true; bytes: Uint8Array; encoding: "binary"; text: null; hex: string }
  | { ok: false };

/**
 * Decode a Horizon data value. Invalid base64 is a failure.
 * Invalid or non-printable UTF-8 is binary, not a failure.
 */
export function decodeDataValue(rawBase64: string): DecodedDataValue {
  const trimmed = rawBase64.trim();

  if (!isBase64(trimmed)) {
    return { ok: false };
  }

  const bytes = Buffer.from(padBase64(trimmed), "base64");
  const canonical = Buffer.from(bytes).toString("base64").replace(/=+$/, "");

  if (canonical !== trimmed.replace(/=+$/, "")) {
    return { ok: false };
  }

  const hex = Buffer.from(bytes).toString("hex");
  const text = decodeUtf8(bytes);

  if (text === null || !isPrintableText(text, bytes)) {
    return { ok: true, bytes, encoding: "binary", text: null, hex };
  }

  return { ok: true, bytes, encoding: "text", text, hex };
}

function isBase64(value: string): boolean {
  if (value.length === 0) {
    return true;
  }

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(value)) {
    return false;
  }

  return value.replace(/=+$/, "").length % 4 !== 1;
}

function padBase64(value: string): string {
  const remainder = value.length % 4;
  return remainder === 0 ? value : `${value}${"=".repeat(4 - remainder)}`;
}

function decodeUtf8(bytes: Uint8Array): string | null {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

function isPrintableText(text: string, bytes: Uint8Array): boolean {
  if (bytes.includes(0)) {
    return false;
  }

  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;

    if (code === 0x7f || (code < 0x20 && !PRINTABLE_CONTROLS.has(code))) {
      return false;
    }
  }

  return true;
}
