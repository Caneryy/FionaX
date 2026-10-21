import { copy } from "@/app/tools/asset-metadata/copy";
import { MissingFieldNotice } from "@/app/tools/asset-metadata/components/MissingFieldNotice";
import type { MetadataField } from "@/app/tools/asset-metadata/types";

export function MetadataFields({ fields }: { fields: readonly MetadataField[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-extrabold text-[#172033]">{copy.fieldsHeading}</h2>
      <ul className="space-y-3">
        {fields.map((field) => (
          <li key={field.key} className="min-w-0 rounded-md border border-[#d5e3ee] bg-white/70 p-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#6d7c90]">{field.label}</p>
            {field.present ? (
              <div className="mt-1 min-w-0 space-y-2">
                {field.imageUrl ? (
                  // Issuer-hosted images are arbitrary https URLs, outside next/image remote patterns.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={field.imageUrl}
                    alt={copy.imageAlt}
                    className="h-16 w-16 max-w-full rounded-md border border-[#d5e3ee] object-contain"
                  />
                ) : null}
                {field.href ? (
                  <a
                    href={field.href}
                    className="block break-all text-sm font-semibold text-[#146783] underline"
                    rel="noreferrer noopener"
                  >
                    {field.display}
                  </a>
                ) : (
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#172033]">{field.display}</p>
                )}
              </div>
            ) : (
              <MissingFieldNotice label={field.label} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
