import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Locale } from '@/i18n/routing'
import { formatDate } from '@/lib/format'
import { asMedia, mediaUrl } from '@/lib/media'
import { getActualite } from '@/lib/queries'
import { alternates, SITE_URL } from '@/lib/seo'

export const revalidate = 600
type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const a = await getActualite(locale, slug)
  if (!a) return {}
  const img = mediaUrl(a.image, 'large')
  return {
    title: a.seo?.titre || a.titre,
    description: a.seo?.description || a.extrait || undefined,
    alternates: alternates(locale, `/actualites/${slug}`),
    openGraph: { type: 'article', images: img ? [img] : undefined },
  }
}

export default async function ActualitePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const a = await getActualite(locale, slug)
  if (!a) notFound()
  const t = await getTranslations()
  const img = mediaUrl(a.image, 'large')
  const url = encodeURIComponent(`${SITE_URL}/${locale}/actualites/${slug}`)
  return (
    <>
      <PageHeader
        titre={a.titre}
        crumbs={[
          { label: t('commun.accueil'), href: '/' },
          { label: t('nav.actualites'), href: '/actualites' },
          { label: a.titre },
        ]}
      >
        <time dateTime={a.date} className="mt-4 block text-nuit-200">
          {formatDate(a.date, locale)}
        </time>
      </PageHeader>
      <Container className="max-w-3xl py-12">
        {img && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-carte)] bg-nuit-100">
            <Image
              src={img}
              alt={asMedia(a.image)?.alt ?? ''}
              fill
              priority
              sizes="768px"
              className="object-cover"
            />
          </div>
        )}
        {a.extrait && <p className="text-xl leading-relaxed text-nuit-800">{a.extrait}</p>}
        <RichText data={a.contenu} />
        {/* Partage sans script tiers (F2) */}
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-nuit-100 pt-6 text-sm">
          <span className="font-semibold">{t('actualites.partager')} :</span>
          <a
            className="text-iama-700 hover:underline"
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noopener"
          >
            Facebook
          </a>
          <a
            className="text-iama-700 hover:underline"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
            target="_blank"
            rel="noopener"
          >
            LinkedIn
          </a>
          <a
            className="text-iama-700 hover:underline"
            href={`https://wa.me/?text=${url}`}
            target="_blank"
            rel="noopener"
          >
            WhatsApp
          </a>
        </div>
      </Container>
    </>
  )
}
