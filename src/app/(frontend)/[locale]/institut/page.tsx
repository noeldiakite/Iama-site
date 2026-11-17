import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Locale } from '@/i18n/routing'
import { mediaUrl } from '@/lib/media'
import { getPage, getParametres } from '@/lib/queries'
import { alternates } from '@/lib/seo'

export const revalidate = 600
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = await getPage(locale, 'institut')
  const t = await getTranslations({ locale, namespace: 'institut' })
  return {
    title: page?.seo?.titre || page?.titre || t('titre'),
    description: page?.seo?.description || page?.chapeau || undefined,
    alternates: alternates(locale, '/institut'),
  }
}

export default async function InstitutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const [page, parametres] = await Promise.all([getPage(locale, 'institut'), getParametres(locale)])
  const img = mediaUrl(page?.image, 'large') ?? '/images/batiment-iama.jpg'
  return (
    <>
      <PageHeader
        titre={page?.titre ?? t('institut.titre')}
        intro={page?.chapeau}
        crumbs={[{ label: t('commun.accueil'), href: '/' }, { label: t('nav.institut') }]}
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RichText data={page?.contenu} />
        </div>
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-carte)]">
            <Image
              src={img}
              alt=""
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
          {!!parametres?.chiffresCles?.length && (
            <div className="mt-8 rounded-[var(--radius-carte)] bg-nuit-950 p-6 text-white">
              <h2 className="text-lg font-bold text-white">{t('institut.chiffres')}</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                {parametres.chiffresCles.map((c) => (
                  <div key={c.id}>
                    <dd className="font-display text-3xl font-extrabold text-iama-400">
                      {c.valeur}
                    </dd>
                    <dt className="text-sm text-nuit-200">{c.libelle}</dt>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </Container>
    </>
  )
}
