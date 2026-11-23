const PRINTABLE_CONTROLS = new Set([0x09, 0x0a, 0x0d]);

/**
 * Decode bytes as UTF-8. Returns null when the sequence is not valid UTF-8.
 */
export function decodeUtf8(bytes: Uint8Array): string | null {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/**
 * True when every code point is printable (including tab / LF / CR).
 * Null bytes and other controls mark the payload as binary.
 */
export function isPrintableUtf8(text: string, bytes: Uint8Array): boolean {
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

/**
 * Flag non-UTF-8 or non-printable text-memo bytes as binary content.
 */
export function detectBinaryText(bytes: Uint8Array): { binary: boolean; text: string | null } {
  const text = decodeUtf8(bytes);

  if (text === null || !isPrintableUtf8(text, bytes)) {
    return { binary: true, text: null };
  }

  return { binary: false, text };
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function decodeBase64ToBytes(raw: string): Uint8Array | null {
  const trimmed = raw.trim();

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) || trimmed.replace(/=+$/, "").length % 4 === 1) {
    return null;
  }

  try {
    if (typeof Buffer !== "undefined") {
      const padded = padBase64(trimmed);
      const bytes = Buffer.from(padded, "base64");
      const canonical = Buffer.from(bytes).toString("base64").replace(/=+$/, "");
      if (canonical !== trimmed.replace(/=+$/, "")) {
        return null;
      }
      return new Uint8Array(bytes);
    }

    const binary = atob(padBase64(trimmed));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function padBase64(value: string): string {
  const remainder = value.length % 4;
  return remainder === 0 ? value : `${value}${"=".repeat(4 - remainder)}`;
}
