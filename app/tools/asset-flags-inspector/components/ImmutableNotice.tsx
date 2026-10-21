import { copy } from "@/app/tools/asset-flags-inspector/copy";

interface ImmutableNoticeProps {
  immutableNotice: string | null;
  adjustableNotice: string | null;
}

/**
 * auth_immutable is called out on its own.
 * The other three flags stay in the row list; this notice only talks about whether they can change.
 */
export function ImmutableNotice({ immutableNotice, adjustableNotice }: ImmutableNoticeProps) {
  if (immutableNotice) {
    return (
      <section className="rounded-md border border-[#ffc3a8] bg-[#fff2e9] p-4" aria-labelledby="issuer-immutable-notice">
        <h2 id="issuer-immutable-notice" className="text-sm font-extrabold text-[#9a513f]">
          {copy.immutable.title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#4e5c73]">{immutableNotice}</p>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-[#82cbe3]/70 bg-[#e0f6ff] p-4" aria-labelledby="issuer-adjustable-notice">
      <h2 id="issuer-adjustable-notice" className="text-sm font-extrabold text-[#146783]">
        {copy.adjustable.title}
      </h2>
      <p className="mt-1 text-sm leading-6 text-[#4e5c73]">{adjustableNotice}</p>
    </section>
  );
}
