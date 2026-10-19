import type { Predicate } from "../types";
import { predicateLabel } from "../lib/predicate-render";

export function PredicateTree({ predicate }: { predicate: Predicate }) {
  const children = predicate.kind === "and" || predicate.kind === "or" ? predicate.children : predicate.kind === "not" ? [predicate.child] : [];
  return <div className="text-sm text-[#29364d]">
    <span>{predicateLabel(predicate)}</span>
    {children.length > 0 ? <ul className="ml-4 mt-1 list-disc space-y-1 border-l border-[#cfe0ea] pl-4">
      {children.map((child, index) => <li key={index}><PredicateTree predicate={child} /></li>)}
    </ul> : null}
  </div>;
}
