import { copy } from "../copy";

export function InputSizeWarning() {
  return <p id="xdr-size-warning" role="alert" className="text-sm text-[#9a513f]">{copy.sizeWarning}</p>;
}
