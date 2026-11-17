import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { FormationCard } from '@/components/FormationCard'
import { IconArrow, IconPlane, IconShield, IconUsers } from '@/components/Icons'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatDate } from '@/lib/format'
import { mediaUrl } from '@/lib/media'
import {
  getActualites,
  getFormations,
  getMetiers,
  getParametres,
  getPartenaires,
} from '@/lib/queries'

export const revalidate = 600

export default async function Accueil({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('accueil')
  const [parametres, vedettes, toutes, metiers, actualites, partenaires] = await Promise.all([
    getParametres(locale),
    getFormations(locale, { vedette: true, limit: 6 }),
    getFormations(locale, { limit: 6 }),
    getMetiers(locale),
    getActualites(locale, 3),
    getPartenaires(locale),
  ])
  const formations = (vedettes.length ? vedettes : toutes).slice(0, 6)
  const chiffres = parametres?.chiffresCles ?? []

  return (
    <>
      {/* Bandeau d'accueil */}
      <section className="relative isolate overflow-hidden bg-nuit-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_10%,rgb(255_63_30/0.28),transparent_60%),radial-gradient(50%_60%_at_0%_100%,rgb(46_82_133/0.6),transparent_70%)]"
        />
        <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-nuit-100 uppercase ring-1 ring-white/15">
              <IconShield width={14} height={14} className="text-iama-400" /> ANAC Mali · IATA
            </p>
            <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold text-white sm:text-5xl lg:text-6xl">
              {parametres?.accroche || t('accroche')}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-nuit-100">
              {parametres?.sousTitre || t('sousTitre')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/formations" size="lg">
                {t('voirCatalogue')} <IconArrow />
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="clair">
                {t('nousContacter')}
              </ButtonLink>
            </div>
          </div>
          <div className="relative lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/10">
              <Image
                src="/images/batiment-iama.jpg"
                alt="Le bâtiment de l’IAMA à l’aéroport de Bamako-Sénou"
                fill
                priority
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
            </div>
            <Image
              src="/images/avion.png"
              alt=""
              width={1231}
              height={325}
              className="pointer-events-none absolute -bottom-8 -left-10 w-[85%] drop-shadow-2xl"
            />
          </div>
        </Container>
        {chiffres.length > 0 && (
          <div className="border-t border-white/10 bg-nuit-900/60">
            <Container>
              <dl className="grid grid-cols-2 divide-white/10 py-6 sm:grid-cols-4 sm:divide-x">
                {chiffres.map((c) => (
                  <div key={c.id} className="px-4 py-3 text-center">
                    <dt className="order-2 text-sm text-nuit-200">{c.libelle}</dt>
                    <dd className="font-display text-3xl font-extrabold text-white">{c.valeur}</dd>
                  </div>
                ))}
              </dl>
            </Container>
          </div>
        )}
      </section>

      {/* Formations à la une */}
      <section className="bg-sable-50 py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle
              surtitre={t('voirCatalogue')}
              titre={t('formationsVedette')}
              intro={t('formationsVedetteIntro')}
            />
            <ButtonLink href="/formations" variant="secondaire">
              {t('toutesFormations')} <IconArrow width={16} height={16} />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formations.map((f) => (
              <FormationCard key={f.id} formation={f} locale={locale} />
            ))}
          </div>
        </Container>
      </section>

      {/* Atouts */}
      <section className="py-20">
        <Container>
          <SectionTitle titre={t('pourquoi')} align="center" />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {(
              [
                ['agrement', IconShield],
                ['pratique', IconPlane],
                ['formateurs', IconUsers],
              ] as const
            ).map(([key, Icon]) => (
              <li
                key={key}
                className="rounded-[var(--radius-carte)] bg-white p-7 ring-1 ring-nuit-100"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-iama-50 text-iama-600">
                  <Icon width={24} height={24} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{t(`atouts.${key}.titre`)}</h3>
                <p className="mt-2 text-nuit-700">{t(`atouts.${key}.texte`)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Métiers */}
      {metiers.length > 0 && (
        <section className="bg-nuit-50 py-20">
          <Container>
            <SectionTitle titre={t('metiers')} />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metiers.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/metiers#${m.slug}`}
                    className="group flex h-full items-start gap-4 rounded-xl bg-white p-5 ring-1 ring-nuit-100 hover:ring-iama-200"
                  >
                    <span
                      className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-iama-500"
                      aria-hidden
                    />
                    <span>
                      <span className="block font-bold text-nuit-950 group-hover:text-iama-700">
                        {m.titre}
                      </span>
                      {m.description && (
                        <span className="mt-1 line-clamp-2 block text-sm text-nuit-700">
                          {m.description}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Actualités */}
      {actualites.length > 0 && (
        <section className="py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionTitle titre={t('actualites')} />
              <ButtonLink href="/actualites" variant="lien">
                {t('toutesActualites')} <IconArrow width={16} height={16} />
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {actualites.map((a) => {
                const img = mediaUrl(a.image, 'carte')
                return (
                  <article
                    key={a.id}
                    className="group relative overflow-hidden rounded-[var(--radius-carte)] ring-1 ring-nuit-100"
                  >
                    <div className="relative aspect-[16/10] bg-nuit-100">
                      {img && (
                        <Image
                          src={img}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <time dateTime={a.date} className="text-sm text-nuit-600">
                        {formatDate(a.date, locale)}
                      </time>
                      <h3 className="mt-1 text-lg font-bold">
                        <Link
                          href={`/actualites/${a.slug}`}
                          className="after:absolute after:inset-0 group-hover:text-iama-700"
                        >
                          {a.titre}
                        </Link>
                      </h3>
                    </div>
                  </article>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Partenaires */}
      {partenaires.length > 0 && (
        <section className="border-y border-nuit-100 py-14">
          <Container>
            <h2 className="text-center text-sm font-semibold tracking-wider text-nuit-600 uppercase">
              {t('partenaires')}
            </h2>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
              {partenaires.map((p) => {
                const logo = mediaUrl(p.logo)
                return (
                  <li key={p.id}>
                    {logo ? (
                      <Image
                        src={logo}
                        alt={p.nom}
                        width={180}
                        height={60}
                        className="h-12 w-auto object-contain"
                      />
                    ) : (
                      <span className="font-bold text-nuit-700">{p.nom}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </Container>
        </section>
      )}

      {/* Appel à l'action */}
      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-iama-600 px-8 py-12 text-white sm:px-14">
            <div
              aria-hidden
              className="absolute -right-10 -bottom-16 h-64 w-64 rounded-full bg-white/10"
            />
            <h2 className="max-w-2xl text-3xl font-extrabold text-white">{t('ctaTitre')}</h2>
            <p className="mt-3 max-w-2xl text-lg text-iama-50">{t('ctaTexte')}</p>
            <ButtonLink href="/contact" variant="clair" size="lg" className="mt-8">
              {t('ctaBouton')}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
