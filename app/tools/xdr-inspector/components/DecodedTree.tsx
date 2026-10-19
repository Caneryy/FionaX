import { copy } from "../copy";

export function DecodedTree({ json }: { json: string }) {
  return <section aria-label={copy.treeLabel} className="max-h-[36rem] overflow-auto rounded-md bg-[#172033] p-4 text-[#e0f6ff]">
    <pre className="whitespace-pre font-mono text-xs leading-5">{json}</pre>
  </section>;
}
