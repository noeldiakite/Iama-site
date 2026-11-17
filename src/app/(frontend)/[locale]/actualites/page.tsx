import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatDate } from '@/lib/format'
import { mediaUrl } from '@/lib/media'
import { getActualites } from '@/lib/queries'
import { alternates } from '@/lib/seo'

export const revalidate = 600
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'actualites' })
  return {
    title: t('titre'),
    description: t('intro'),
    alternates: alternates(locale, '/actualites'),
  }
}

export default async function ActualitesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const items = await getActualites(locale, 50)
  return (
    <>
      <PageHeader
        titre={t('actualites.titre')}
        intro={t('actualites.intro')}
        crumbs={[{ label: t('commun.accueil'), href: '/' }, { label: t('nav.actualites') }]}
      />
      <Container className="py-14">
        {items.length === 0 && (
          <p className="text-center text-nuit-700">{t('actualites.aucune')}</p>
        )}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => {
            const img = mediaUrl(a.image, 'carte')
            return (
              <article
                key={a.id}
                className="group relative overflow-hidden rounded-[var(--radius-carte)] bg-white ring-1 ring-nuit-100"
              >
                <div className="relative aspect-[16/10] bg-nuit-100">
                  {img && (
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <time dateTime={a.date} className="text-sm text-nuit-600">
                    {formatDate(a.date, locale)}
                  </time>
                  <h2 className="mt-1 text-lg font-bold">
                    <Link
                      href={`/actualites/${a.slug}`}
                      className="after:absolute after:inset-0 group-hover:text-iama-700"
                    >
                      {a.titre}
                    </Link>
                  </h2>
                  {a.extrait && (
                    <p className="mt-2 line-clamp-3 text-sm text-nuit-700">{a.extrait}</p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </>
  )
}
