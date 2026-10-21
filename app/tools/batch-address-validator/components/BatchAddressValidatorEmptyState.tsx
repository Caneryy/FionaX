import { copy } from "@/app/tools/batch-address-validator/copy";

export function BatchAddressValidatorEmptyState({ submitted = false }: { submitted?: boolean }) {
  return (
    <div className="rounded-lg border border-dashed border-[#82cbe3]/70 bg-[#e0f6ff] p-4">
      <p className="text-sm font-extrabold text-[#146783]">{submitted ? copy.emptySubmittedTitle : copy.emptyTitle}</p>
      <p className="mt-2 text-sm leading-6 text-[#4e5c73]">
        {submitted ? copy.errors.empty_batch : copy.emptyDescription}
      </p>
    </div>
  );
}
