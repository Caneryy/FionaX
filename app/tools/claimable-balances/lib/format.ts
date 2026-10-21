export function formatAsset(asset: string): string {
  return asset === "native" ? "XLM" : asset.replace(":", " · ");
}

export function formatAmount(amount: string): string {
  // Keep Horizon's exact decimal representation; Number would round large amounts.
  return amount;
}

export function formatUtc(unixSeconds: string): string {
  if (unixSeconds.includes("T")) return unixSeconds.replace(/Z$/, " UTC");
  const value = /^[0-9]+$/.test(unixSeconds)
    ? Number(BigInt(unixSeconds) * BigInt(1000))
    : Date.parse(unixSeconds);
  if (!Number.isSafeInteger(value)) throw new RangeError("Timestamp out of range");
  return new Date(value).toISOString().replace(".000Z", " UTC");
}
