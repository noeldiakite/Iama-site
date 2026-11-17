import Image from 'next/image'

/** Logo provisoire (version du site actuel, 124×48). À remplacer par le logo HD fourni par l'IAMA. */
export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className={inverse ? 'rounded-md bg-white px-1.5 py-1' : ''}>
        <Image src="/images/logo-iama.png" alt="IAMA" width={93} height={36} priority />
      </span>
      <span
        className={`hidden text-[0.7rem] leading-tight font-semibold tracking-wide uppercase lg:block ${inverse ? 'text-nuit-100' : 'text-nuit-700'}`}
      >
        Institut Africain
        <br />
        des Métiers de l’Aérien
      </span>
    </span>
  )
}
