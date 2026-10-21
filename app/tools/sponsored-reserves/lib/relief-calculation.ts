// One reserve unit is 0.5 XLM, or 5,000,000 stroops, on current Stellar networks.
export const STROOPS_PER_RESERVE = BigInt("5000000");

export function reserveReliefStroops(sponsoredReserveUnits: bigint): bigint {
  if (sponsoredReserveUnits < BigInt("0")) throw new RangeError("Negative reserve units");
  return sponsoredReserveUnits * STROOPS_PER_RESERVE;
}
