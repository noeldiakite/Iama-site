import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getFormations, getMetiers } from '@/lib/queries'
import { alternates } from '@/lib/seo'

export const revalidate = 600
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metiers' })
  return { title: t('titre'), description: t('intro'), alternates: alternates(locale, '/metiers') }
}

export default async function MetiersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const [metiers, formations] = await Promise.all([getMetiers(locale), getFormations(locale)])
  return (
    <>
      <PageHeader
        titre={t('metiers.titre')}
        intro={t('metiers.intro')}
        crumbs={[{ label: t('commun.accueil'), href: '/' }, { label: t('nav.metiers') }]}
      />
      <Container className="py-14">
        <ul className="grid gap-6 md:grid-cols-2">
          {metiers.map((m) => {
            const liees = formations.filter((f) =>
              f.metiers?.some((x) => (typeof x === 'object' ? x.id : x) === m.id),
            )
            return (
              <li
                key={m.id}
                id={m.slug ?? undefined}
                className="scroll-mt-28 rounded-[var(--radius-carte)] bg-white p-7 ring-1 ring-nuit-100"
              >
                <h2 className="text-xl font-bold">{m.titre}</h2>
                <p className="mt-3 text-nuit-700">{m.description}</p>
                {liees.length > 0 && (
                  <div className="mt-5 border-t border-nuit-100 pt-4">
                    <p className="text-sm font-semibold text-nuit-600">
                      {t('metiers.formationsLiees')}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {liees.map((f) => (
                        <li key={f.id}>
                          <Link
                            href={`/formations/${f.slug}`}
                            className="text-sm font-medium text-iama-700 hover:underline"
                          >
                            {f.titre}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </Container>
    </>
  )
}
