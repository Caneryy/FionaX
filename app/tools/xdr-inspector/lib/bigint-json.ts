// Walk SDK XDR objects through their public struct/union accessors, preserving
// names and nesting that JSON.stringify would otherwise hide in SDK internals.
export function toJsonSafe(value: unknown): unknown {
  if (value === null || value === undefined) return value ?? null;
  if (typeof value === "bigint") return value.toString();
  if (typeof value !== "object") return value;
  if (value instanceof Uint8Array) return Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (Array.isArray(value)) return value.map(toJsonSafe);

  const object = value as {
    constructor: { _fields?: [string, unknown][]; enumName?: string; unionName?: string };
    name?: string;
    toBigInt?: () => bigint;
    switch?: () => unknown;
    arm?: () => string | undefined;
    value?: () => unknown;
    [key: string]: unknown;
  };
  if (typeof object.toBigInt === "function") return object.toBigInt().toString();
  if (object.constructor.enumName) return object.name;
  if (object.constructor.unionName && object.switch && object.arm && object.value) {
    const arm = object.arm();
    return {
      switch: toJsonSafe(object.switch()),
      ...(arm ? { [arm]: toJsonSafe(object.value()) } : {})
    };
  }
  if (object.constructor._fields) {
    return Object.fromEntries(object.constructor._fields.map(([name]) => [
      name, toJsonSafe((object[name] as () => unknown)())
    ]));
  }
  return Object.fromEntries(Object.entries(object).map(([key, item]) => [key, toJsonSafe(item)]));
}

export function stringifyXdr(value: unknown): string {
  return JSON.stringify(toJsonSafe(value), null, 2);
}
