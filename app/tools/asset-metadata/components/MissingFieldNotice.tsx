import { copy } from "@/app/tools/asset-metadata/copy";

export function MissingFieldNotice({ label }: { label: string }) {
  return <p className="mt-1 text-sm leading-6 text-[#9a513f]">{copy.missingField(label)}</p>;
}
