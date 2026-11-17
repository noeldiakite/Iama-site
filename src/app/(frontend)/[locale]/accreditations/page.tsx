import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { IconDownload } from '@/components/Icons'
import { Badge } from '@/components/ui/Badge'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Locale } from '@/i18n/routing'
import { asMedia, mediaUrl } from '@/lib/media'
import { getAccreditations } from '@/lib/queries'
import { alternates } from '@/lib/seo'

export const revalidate = 600
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'accreditations' })
  return {
    title: t('titre'),
    description: t('intro'),
    alternates: alternates(locale, '/accreditations'),
  }
}

export default async function AccreditationsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const items = await getAccreditations(locale)
  return (
    <>
      <PageHeader
        titre={t('accreditations.titre')}
        intro={t('accreditations.intro')}
        crumbs={[{ label: t('commun.accueil'), href: '/' }, { label: t('nav.accreditations') }]}
      />
      <Container className="py-14">
        <ul className="grid gap-8 md:grid-cols-3">
          {items.map((a) => {
            const img = mediaUrl(a.image, 'carte')
            const doc = asMedia(a.document)
            return (
              <li
                key={a.id}
                className="flex flex-col overflow-hidden rounded-[var(--radius-carte)] bg-white ring-1 ring-nuit-100"
              >
                <div className="relative aspect-[3/4] bg-nuit-50">
                  {img && (
                    <Image
                      src={img}
                      alt={asMedia(a.image)?.alt ?? a.titre}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-contain p-4"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {a.organisme && <Badge tone="rouge">{a.organisme.toUpperCase()}</Badge>}
                  <h2 className="mt-3 text-base leading-snug font-bold">{a.titre}</h2>
                  {a.description && <p className="mt-2 text-sm text-nuit-700">{a.description}</p>}
                  {doc?.url && (
                    <a
                      href={doc.url}
                      className="mt-auto flex items-center gap-2 pt-4 text-sm font-semibold text-iama-700 hover:underline"
                    >
                      <IconDownload width={16} height={16} /> {t('accreditations.telecharger')}
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </>
  )
}
