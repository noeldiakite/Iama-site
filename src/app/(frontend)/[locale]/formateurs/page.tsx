import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Locale } from '@/i18n/routing'
import { mediaUrl } from '@/lib/media'
import { getFormateurs } from '@/lib/queries'
import { alternates } from '@/lib/seo'

export const revalidate = 600
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'formateurs' })
  return {
    title: t('titre'),
    description: t('intro'),
    alternates: alternates(locale, '/formateurs'),
  }
}

export default async function FormateursPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const formateurs = await getFormateurs(locale)
  return (
    <>
      <PageHeader
        titre={t('formateurs.titre')}
        intro={t('formateurs.intro')}
        crumbs={[{ label: t('commun.accueil'), href: '/' }, { label: t('nav.formateurs') }]}
      />
      <Container className="py-14">
        {formateurs.length === 0 ? (
          <p className="rounded-[var(--radius-carte)] bg-nuit-50 p-10 text-center text-nuit-700">
            {t('formateurs.aucun')}
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formateurs.map((f) => {
              const photo = mediaUrl(f.photo, 'carte')
              return (
                <li
                  key={f.id}
                  id={f.slug ?? undefined}
                  className="overflow-hidden rounded-[var(--radius-carte)] bg-white ring-1 ring-nuit-100"
                >
                  <div className="relative aspect-square bg-nuit-100">
                    {photo && <Image src={photo} alt={f.nom} fill className="object-cover" />}
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-bold">{f.nom}</h2>
                    <p className="text-sm font-medium text-iama-700">{f.fonction}</p>
                    {f.biographie && <p className="mt-3 text-sm text-nuit-700">{f.biographie}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Container>
    </>
  )
}
