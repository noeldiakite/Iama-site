import type { ReactNode } from 'react'

export function SectionTitle({
  surtitre,
  titre,
  intro,
  align = 'left',
  as: Tag = 'h2',
}: {
  surtitre?: string
  titre: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {surtitre && (
        <p className="mb-2 text-sm font-semibold tracking-wider text-iama-700 uppercase">
          {surtitre}
        </p>
      )}
      <Tag
        className={
          Tag === 'h1' ? 'text-4xl font-extrabold sm:text-5xl' : 'text-3xl font-bold sm:text-4xl'
        }
      >
        {titre}
      </Tag>
      {intro && <p className="mt-4 text-lg text-nuit-700">{intro}</p>}
    </div>
  )
}
