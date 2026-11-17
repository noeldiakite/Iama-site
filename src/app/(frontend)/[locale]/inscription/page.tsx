import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { InscriptionForm, type OptionFormation } from '@/components/InscriptionForm'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Locale } from '@/i18n/routing'
import { formatPeriode } from '@/lib/format'
import { getFormations } from '@/lib/queries'
import { alternates } from '@/lib/seo'
import { sessionsAVenir } from '@/lib/sessions'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ formation?: string; session?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'inscription' })
  return { title: t('titre'), alternates: alternates(locale, '/inscription') }
}

export default async function InscriptionPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { formation, session } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations()
  const formations = await getFormations(locale)
  const options: OptionFormation[] = formations
    .filter((f) => f.slug)
    .map((f) => ({
      slug: f.slug!,
      titre: f.titre,
      sessions: sessionsAVenir(f).map((s) => ({
        id: s.id!,
        libelle: `${formatPeriode(s.dateDebut, s.dateFin, locale)}${s.lieu ? ` — ${s.lieu}` : ''}`,
        complete: s.statut !== 'ouverte' || s.placesRestantes === 0,
      })),
    }))

  return (
    <>
      <PageHeader
        titre={t('inscription.titre')}
        intro={t('inscription.intro')}
        crumbs={[{ label: t('commun.accueil'), href: '/' }, { label: t('nav.inscription') }]}
      />
      <Container className="py-12">
        <div className="mx-auto max-w-3xl rounded-[var(--radius-carte)] bg-white p-6 shadow-[var(--shadow-carte)] ring-1 ring-nuit-100 sm:p-10">
          <InscriptionForm
            formations={options}
            formationInitiale={formation}
            sessionInitiale={session}
          />
        </div>
      </Container>
    </>
  )
}
