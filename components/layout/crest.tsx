import Image from "next/image";

/** Emblem cropped from the owner's exact original artwork. */
export function Crest({ className = "" }: { className?: string }) {
  return (
    <Image
      className={`original-emblem ${className}`}
      src="/images/brand/ardhanari-emblem.png"
      width={512}
      height={512}
      sizes="88px"
      alt="Ardhanari lotus emblem"
    />
  );
}
