import type { ClaimableBalance } from "../types";
import { copy } from "../copy";
import { formatAmount, formatAsset } from "../lib/format";
import { PredicateTree } from "./PredicateTree";

export function BalanceRows({ balances }: { balances: ClaimableBalance[] }) {
  return <ul className="space-y-4">{balances.map((balance) => <li key={balance.id} className="rounded-lg border border-[#cfe0ea] bg-white/80 p-4">
    <dl className="grid gap-2 text-sm sm:grid-cols-2">
      <div><dt className="font-semibold">{copy.asset}</dt><dd className="break-all">{formatAsset(balance.asset)}</dd></div>
      <div><dt className="font-semibold">{copy.amount}</dt><dd>{formatAmount(balance.amount)}</dd></div>
      <div className="sm:col-span-2"><dt className="font-semibold">{copy.sponsor}</dt><dd className="break-all">{balance.sponsor ?? copy.noSponsor}</dd></div>
      <div className="sm:col-span-2"><dt className="font-semibold">{copy.predicate}</dt><dd className="mt-1"><PredicateTree predicate={balance.predicate} /></dd></div>
    </dl>
  </li>)}</ul>;
}
