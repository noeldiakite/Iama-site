import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { IconCalendar, IconCheck, IconClock, IconDownload, IconPin } from '@/components/Icons'
import { RichText } from '@/components/RichText'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Formateur, Metier } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { formatPeriode, formatPrix } from '@/lib/format'
import { asMedia, mediaUrl } from '@/lib/media'
import { getFormation, getFormations } from '@/lib/queries'
import { alternates } from '@/lib/seo'
import { sessionsAVenir } from '@/lib/sessions'

export const revalidate = 600
export const dynamicParams = true

type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  try {
    const formations = await getFormations(params.locale as Locale)
    return formations.filter((f) => f.slug).map((f) => ({ slug: f.slug! }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const f = await getFormation(locale, slug)
  if (!f) return {}
  const img = mediaUrl(f.image, 'large')
  return {
    title: f.seo?.titre || f.titre,
    description: f.seo?.description || f.resume || undefined,
    alternates: alternates(locale, `/formations/${slug}`),
    openGraph: img ? { images: [img] } : undefined,
  }
}

export default async function FormationPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const f = await getFormation(locale, slug)
  if (!f) notFound()
  const t = await getTranslations()
  const img = mediaUrl(f.image, 'large')
  const prix = formatPrix(f.prix, locale)
  const sessions = sessionsAVenir(f)
  const brochure = asMedia(f.brochure)
  const formateurs = (f.formateurs ?? []).filter((x): x is Formateur => typeof x === 'object')
  const metiers = (f.metiers ?? []).filter((x): x is Metier => typeof x === 'object')
  const domaine = typeof f.domaine === 'object' ? f.domaine : null

  const duree = [
    f.dureeJours ? t('formation.jours', { count: f.dureeJours }) : null,
    f.dureeHeures ? t('formation.heures', { count: f.dureeHeures }) : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <PageHeader
        titre={f.titre}
        intro={f.resume}
        crumbs={[
          { label: t('commun.accueil'), href: '/' },
          { label: t('nav.formations'), href: '/formations' },
          { label: f.titre },
        ]}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          {domaine && <Badge tone="nuit">{domaine.titre}</Badge>}
          {f.type && <Badge tone="rouge">{t(`formation.types.${f.type}`)}</Badge>}
        </div>
      </PageHeader>

      <Container className="grid gap-12 py-12 lg:grid-cols-12">
        <article className="lg:col-span-8">
          {img && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-carte)] bg-nuit-100">
              <Image
                src={img}
                alt={asMedia(f.image)?.alt ?? ''}
                fill
                priority
                sizes="(min-width: 1024px) 800px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          <RichText data={f.description} />

          {f.objectifs && f.objectifs.length > 0 && (
            <Section titre={t('formation.objectifs')}>
              <ul className="space-y-3">
                {f.objectifs.map((o) => (
                  <li key={o.id} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-iama-50 text-iama-600">
                      <IconCheck width={14} height={14} />
                    </span>
                    <span>{o.texte}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {f.public && <Encadre titre={t('formation.public')} texte={f.public} />}
            {f.prerequis && <Encadre titre={t('formation.prerequis')} texte={f.prerequis} />}
          </div>

          {f.programme && (
            <Section titre={t('formation.programme')}>
              <RichText data={f.programme} />
            </Section>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {f.methodes && <Encadre titre={t('formation.methodes')} texte={f.methodes} />}
            {f.evaluation && <Encadre titre={t('formation.evaluation')} texte={f.evaluation} />}
            {f.validite && <Encadre titre={t('formation.validite')} texte={f.validite} />}
          </div>

          {formateurs.length > 0 && (
            <Section titre={t('formation.formateurs')}>
              <ul className="grid gap-4 sm:grid-cols-2">
                {formateurs.map((fo) => (
                  <li
                    key={fo.id}
                    className="flex items-center gap-4 rounded-xl p-4 ring-1 ring-nuit-100"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-nuit-100">
                      {mediaUrl(fo.photo, 'vignette') && (
                        <Image
                          src={mediaUrl(fo.photo, 'vignette')!}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </span>
                    <span>
                      <span className="block font-bold">{fo.nom}</span>
                      <span className="text-sm text-nuit-700">{fo.fonction}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {metiers.length > 0 && (
            <Section titre={t('formation.metiers')}>
              <div className="flex flex-wrap gap-2">
                {metiers.map((m) => (
                  <Badge key={m.id}>{m.titre}</Badge>
                ))}
              </div>
            </Section>
          )}
        </article>

        {/* Encadré d'inscription */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-[var(--radius-carte)] bg-white p-6 shadow-[var(--shadow-carte)] ring-1 ring-nuit-100">
              <p className="text-sm text-nuit-600">{t('formation.prix')}</p>
              <p className="font-display text-3xl font-extrabold text-nuit-950">
                {prix ?? t('formation.surDevis')}
                {prix && (
                  <span className="ml-1 text-sm font-medium text-nuit-600">
                    {t('formation.ht')}
                  </span>
                )}
              </p>
              <dl className="mt-5 space-y-3 border-t border-nuit-100 pt-5 text-sm">
                {duree && (
                  <Ligne icone={<IconClock width={18} height={18} />} titre={t('formation.duree')}>
                    {duree}
                  </Ligne>
                )}
                {f.modalites && f.modalites.length > 0 && (
                  <Ligne
                    icone={<IconPin width={18} height={18} />}
                    titre={t('formation.modalites')}
                  >
                    {f.modalites.map((m) => t(`formation.modalitesListe.${m}`)).join(', ')}
                  </Ligne>
                )}
              </dl>
              <ButtonLink
                href={{ pathname: '/inscription', query: { formation: f.slug! } }}
                size="lg"
                className="mt-6 w-full"
              >
                {t('formation.sInscrire')}
              </ButtonLink>
              {brochure?.url && (
                <a
                  href={brochure.url}
                  className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-iama-700 hover:underline"
                >
                  <IconDownload width={16} height={16} /> {t('formation.brochure')}
                </a>
              )}
            </div>

            <div className="rounded-[var(--radius-carte)] bg-nuit-50 p-6">
              <h2 className="text-lg font-bold">{t('formation.sessions')}</h2>
              {sessions.length === 0 ? (
                <p className="mt-3 text-sm text-nuit-700">{t('formation.aucuneSession')}</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {sessions.map((s) => {
                    const ouverte = s.statut === 'ouverte' && (s.placesRestantes ?? 1) > 0
                    return (
                      <li key={s.id} className="rounded-xl bg-white p-4 ring-1 ring-nuit-100">
                        <p className="flex items-center gap-2 font-semibold">
                          <IconCalendar width={16} height={16} className="text-iama-600" />
                          {formatPeriode(s.dateDebut, s.dateFin, locale)}
                        </p>
                        <p className="mt-1 text-sm text-nuit-700">
                          {s.lieu}
                          {typeof s.placesRestantes === 'number' && (
                            <> · {t('formation.places', { count: s.placesRestantes })}</>
                          )}
                        </p>
                        {ouverte ? (
                          <ButtonLink
                            href={{
                              pathname: '/inscription',
                              query: { formation: f.slug!, session: s.id! },
                            }}
                            variant="lien"
                            className="mt-2 text-sm"
                          >
                            {t('formation.sInscrireSession')} →
                          </ButtonLink>
                        ) : (
                          <Badge tone="alerte">{t('formation.complete')}</Badge>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </Container>
    </>
  )
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-5 text-2xl font-bold">{titre}</h2>
      {children}
    </section>
  )
}

function Encadre({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="rounded-xl bg-sable-50 p-5 ring-1 ring-sable-100">
      <h3 className="text-sm font-bold tracking-wide text-nuit-700 uppercase">{titre}</h3>
      <p className="mt-2 whitespace-pre-line text-nuit-900">{texte}</p>
    </div>
  )
}

function Ligne({
  icone,
  titre,
  children,
}: {
  icone: React.ReactNode
  titre: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-nuit-400">{icone}</span>
      <div>
        <dt className="text-nuit-600">{titre}</dt>
        <dd className="font-semibold text-nuit-950">{children}</dd>
      </div>
    </div>
  )
}
