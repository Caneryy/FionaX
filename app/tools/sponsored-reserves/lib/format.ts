import { copy } from "../copy";

export function formatXlm(stroops: bigint): string {
  const sign = stroops < BigInt("0") ? "-" : "";
  const value = stroops < BigInt("0") ? -stroops : stroops;
  const whole = value / BigInt("10000000");
  const fraction = (value % BigInt("10000000")).toString().padStart(7, "0").replace(/0+$/, "");
  return `${sign}${whole}${fraction ? `.${fraction}` : ""} ${copy.unit}`;
}

export function formatReserveCount(count: bigint): string {
  return `${count.toString()} ${count === BigInt("1") ? copy.reserveUnit : copy.reserves}`;
}
