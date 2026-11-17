import Image from 'next/image'
import type { Domaine, Formation } from '@/payload-types'
import { Link } from '@/i18n/navigation'
import { formatDate, formatPrix } from '@/lib/format'
import { mediaUrl } from '@/lib/media'
import { prochaineSession } from '@/lib/sessions'
import { IconArrow, IconCalendar, IconClock } from './Icons'
import { Badge } from './ui/Badge'

export type CardLabels = {
  surDevis: string
  jours: string | null
  voir: string
  type: string | null
}

/** Carte de formation (design system) : utilisable côté serveur et dans le catalogue filtrable. */
export function FormationCardView({
  formation,
  locale,
  labels,
}: {
  formation: Formation
  locale: string
  labels: CardLabels
}) {
  const img = mediaUrl(formation.image, 'carte')
  const domaine =
    typeof formation.domaine === 'object' ? (formation.domaine as Domaine | null) : null
  const prix = formatPrix(formation.prix, locale)
  const session = prochaineSession(formation)
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-carte)] bg-white shadow-[var(--shadow-carte)] ring-1 ring-nuit-100 transition hover:-translate-y-0.5 hover:ring-nuit-200">
      <div className="relative aspect-[16/10] bg-nuit-100">
        {img && (
          <Image
            src={img}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        {domaine && (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-nuit-900 shadow-sm">
            {domaine.titre}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {labels.type && (
          <div className="mb-2">
            <Badge tone="rouge">{labels.type}</Badge>
          </div>
        )}
        <h3 className="text-lg leading-snug font-bold">
          <Link
            href={`/formations/${formation.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {formation.titre}
          </Link>
        </h3>
        {formation.resume && (
          <p className="mt-2 line-clamp-3 text-sm text-nuit-700">{formation.resume}</p>
        )}
        <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-nuit-700">
          {labels.jours && (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Durée</dt>
              <IconClock width={16} height={16} className="text-nuit-400" />
              <dd>{labels.jours}</dd>
            </div>
          )}
          {session && (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Session</dt>
              <IconCalendar width={16} height={16} className="text-nuit-400" />
              <dd>
                {formatDate(session.dateDebut, locale, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-auto flex items-end justify-between pt-5">
          <p className="text-base font-bold text-nuit-950">{prix ?? labels.surDevis}</p>
          <span className="flex items-center gap-1 text-sm font-semibold text-iama-700">
            {labels.voir}
            <IconArrow width={16} height={16} className="transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
