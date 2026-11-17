import type { ReactNode } from 'react'

type Tone = 'neutre' | 'rouge' | 'nuit' | 'succes' | 'alerte'

const tones: Record<Tone, string> = {
  neutre: 'bg-nuit-50 text-nuit-700 ring-nuit-200',
  rouge: 'bg-iama-50 text-iama-700 ring-iama-200',
  nuit: 'bg-nuit-900 text-white ring-nuit-900',
  succes: 'bg-green-50 text-succes-600 ring-green-200',
  alerte: 'bg-amber-50 text-alerte-600 ring-amber-200',
}

export function Badge({ children, tone = 'neutre' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
