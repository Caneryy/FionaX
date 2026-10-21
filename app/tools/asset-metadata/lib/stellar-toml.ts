export class TomlParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TomlParseError";
  }
}

export type TomlValue = string | boolean | readonly string[];

export interface CurrencyEntry {
  readonly values: Readonly<Record<string, TomlValue>>;
}

const KEY_PATTERN = /^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/;

/**
 * Collect [[CURRENCIES]] entries from a stellar.toml document.
 * Integers are returned as decimal strings via BigInt, never as Number.
 */
export function parseCurrencyEntries(source: string): CurrencyEntry[] {
  const text = source.replace(/^\uFEFF/, "");
  if (text.trim() === "") {
    throw new TomlParseError("stellar.toml is empty.");
  }

  let index = 0;
  const entries: Array<Record<string, TomlValue>> = [];
  let current: Record<string, TomlValue> | null = null;

  const peek = () => text[index] ?? "";
  const startsWith = (value: string) => text.startsWith(value, index);

  function skipTrivia(newlines: boolean) {
    while (index < text.length) {
      const char = text[index];
      if (char === " " || char === "\t" || (newlines && (char === "\n" || char === "\r"))) {
        index += 1;
        continue;
      }
      if (char === "#") {
        while (index < text.length && text[index] !== "\n") index += 1;
        continue;
      }
      break;
    }
  }

  function expect(value: string) {
    if (!startsWith(value)) {
      throw new TomlParseError("Unexpected token in stellar.toml.");
    }
    index += value.length;
  }

  function readKey(): string {
    const start = index;
    while (index < text.length && /[A-Za-z0-9_.-]/.test(text[index])) index += 1;
    const key = text.slice(start, index);
    if (!KEY_PATTERN.test(key)) {
      throw new TomlParseError("Invalid key in stellar.toml.");
    }
    return key;
  }

  function readUnicodeEscape(size: number): string {
    const hex = text.slice(index, index + size);
    if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length !== size) {
      throw new TomlParseError("Invalid unicode escape in stellar.toml.");
    }
    index += size;
    const codePoint = Number.parseInt(hex, 16);
    if (codePoint > 0x10ffff) {
      throw new TomlParseError("Invalid unicode escape in stellar.toml.");
    }
    return String.fromCodePoint(codePoint);
  }

  function readEscaped(quote: string): string {
    const mapped: Record<string, string> = {
      b: "\b",
      t: "\t",
      n: "\n",
      f: "\f",
      r: "\r",
      "\\": "\\",
      '"': '"'
    };
    const esc = text[index];
    if (!esc) throw new TomlParseError("Unterminated string in stellar.toml.");
    index += 1;
    if (esc === "u") return readUnicodeEscape(4);
    if (esc === "U") return readUnicodeEscape(8);
    if (quote === '"' && esc in mapped) return mapped[esc];
    throw new TomlParseError("Invalid escape in stellar.toml.");
  }

  function readBasicString(): string {
    expect('"');
    let out = "";
    while (index < text.length) {
      const char = text[index];
      if (char === '"') {
        index += 1;
        return out;
      }
      if (char === "\n" || char === "\r") {
        throw new TomlParseError("Unterminated string in stellar.toml.");
      }
      if (char === "\\") {
        index += 1;
        out += readEscaped('"');
        continue;
      }
      out += char;
      index += 1;
    }
    throw new TomlParseError("Unterminated string in stellar.toml.");
  }

  function readLiteralString(): string {
    expect("'");
    const start = index;
    while (index < text.length && text[index] !== "'") {
      if (text[index] === "\n" || text[index] === "\r") {
        throw new TomlParseError("Unterminated string in stellar.toml.");
      }
      index += 1;
    }
    if (text[index] !== "'") throw new TomlParseError("Unterminated string in stellar.toml.");
    const value = text.slice(start, index);
    index += 1;
    return value;
  }

  function readMultiline(quote: string, basic: boolean): string {
    expect(quote + quote + quote);
    if (text[index] === "\r") index += 1;
    if (text[index] === "\n") index += 1;
    let out = "";
    const closer = quote + quote + quote;
    while (index < text.length) {
      if (startsWith(closer)) {
        index += 3;
        return out;
      }
      if (basic && text[index] === "\\") {
        const next = text[index + 1];
        if (next === "\n" || next === "\r") {
          index += 1;
          if (text[index] === "\r") index += 1;
          if (text[index] === "\n") index += 1;
          while (text[index] === " " || text[index] === "\t" || text[index] === "\n" || text[index] === "\r") {
            index += 1;
          }
          continue;
        }
        index += 1;
        out += readEscaped(quote);
        continue;
      }
      out += text[index];
      index += 1;
    }
    throw new TomlParseError("Unterminated string in stellar.toml.");
  }

  function readNumber(): string {
    const start = index;
    if (text[index] === "+" || text[index] === "-") index += 1;
    if (!/[0-9]/.test(peek())) throw new TomlParseError("Invalid number in stellar.toml.");
    while (index < text.length && /[0-9_]/.test(text[index])) index += 1;

    let fractional = false;
    if (text[index] === ".") {
      fractional = true;
      index += 1;
      if (!/[0-9]/.test(peek())) throw new TomlParseError("Invalid number in stellar.toml.");
      while (index < text.length && /[0-9_]/.test(text[index])) index += 1;
    }
    if (text[index] === "e" || text[index] === "E") {
      fractional = true;
      index += 1;
      if (text[index] === "+" || text[index] === "-") index += 1;
      if (!/[0-9]/.test(peek())) throw new TomlParseError("Invalid number in stellar.toml.");
      while (index < text.length && /[0-9_]/.test(text[index])) index += 1;
    }

    const lexeme = text.slice(start, index);
    if (fractional) {
      return lexeme.replace(/_/g, "");
    }

    const negative = lexeme.startsWith("-");
    const digits = lexeme.replace(/^[+-]/, "").replace(/_/g, "");
    if (!/^(0|[1-9][0-9]*)$/.test(digits)) {
      throw new TomlParseError("Invalid integer in stellar.toml.");
    }
    const canonical = BigInt(digits).toString();
    if (canonical === "0") return "0";
    return negative ? `-${canonical}` : canonical;
  }

  function readArray(): readonly string[] {
    expect("[");
    const items: string[] = [];
    while (index < text.length) {
      skipTrivia(true);
      if (peek() === "]") {
        index += 1;
        return items;
      }
      const value = readValue();
      if (typeof value === "string") items.push(value);
      else if (typeof value === "boolean") items.push(value ? "true" : "false");
      else throw new TomlParseError("Nested arrays are not supported in stellar.toml.");
      skipTrivia(true);
      if (peek() === ",") {
        index += 1;
        continue;
      }
      if (peek() === "]") {
        index += 1;
        return items;
      }
      throw new TomlParseError("Invalid array in stellar.toml.");
    }
    throw new TomlParseError("Unterminated array in stellar.toml.");
  }

  function readValue(): TomlValue {
    skipTrivia(false);
    if (startsWith('"""')) return readMultiline('"', true);
    if (startsWith("'''")) return readMultiline("'", false);
    if (peek() === '"') return readBasicString();
    if (peek() === "'") return readLiteralString();
    if (startsWith("true") && !/[A-Za-z0-9_]/.test(text[index + 4] ?? "")) {
      index += 4;
      return true;
    }
    if (startsWith("false") && !/[A-Za-z0-9_]/.test(text[index + 5] ?? "")) {
      index += 5;
      return false;
    }
    if (peek() === "[") return readArray();
    if (peek() === "+" || peek() === "-" || /[0-9]/.test(peek())) return readNumber();
    throw new TomlParseError("Unsupported value in stellar.toml.");
  }

  function finishLine() {
    skipTrivia(false);
    if (peek() === "#") {
      while (index < text.length && text[index] !== "\n") index += 1;
    }
    if (peek() === "\r") index += 1;
    if (peek() === "\n") {
      index += 1;
      return;
    }
    if (index < text.length) {
      throw new TomlParseError("Expected a line break in stellar.toml.");
    }
  }

  function readHeader(): { array: boolean; name: string } {
    if (startsWith("[[")) {
      index += 2;
      const start = index;
      while (index < text.length && text[index] !== "]" && text[index] !== "\n") index += 1;
      const name = text.slice(start, index).trim();
      expect("]]");
      if (!/^[A-Za-z0-9_-]+$/.test(name)) throw new TomlParseError("Invalid table in stellar.toml.");
      return { array: true, name };
    }
    expect("[");
    const start = index;
    while (index < text.length && text[index] !== "]" && text[index] !== "\n") index += 1;
    const name = text.slice(start, index).trim();
    expect("]");
    if (!/^[A-Za-z0-9_.-]+$/.test(name)) throw new TomlParseError("Invalid table in stellar.toml.");
    return { array: false, name };
  }

  while (index < text.length) {
    skipTrivia(true);
    if (index >= text.length) break;
    if (peek() === "[") {
      const header = readHeader();
      finishLine();
      if (header.array && header.name === "CURRENCIES") {
        current = {};
        entries.push(current);
      } else {
        current = null;
      }
      continue;
    }

    const key = readKey();
    skipTrivia(false);
    expect("=");
    const value = readValue();
    finishLine();
    if (!current) continue;
    if (Object.hasOwn(current, key)) {
      throw new TomlParseError("Duplicate currency key in stellar.toml.");
    }
    current[key] = value;
  }

  return entries.map((values) => ({ values }));
}
