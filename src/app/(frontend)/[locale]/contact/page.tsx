import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ContactForm } from '@/components/ContactForm'
import { IconClock, IconMail, IconPhone, IconPin } from '@/components/Icons'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Locale } from '@/i18n/routing'
import { getParametres } from '@/lib/queries'
import { alternates } from '@/lib/seo'

export const revalidate = 600
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('titre'), description: t('intro'), alternates: alternates(locale, '/contact') }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const c = (await getParametres(locale))?.contact

  const lignes = [
    c?.adresse && {
      icone: IconPin,
      titre: t('contact.adresse'),
      contenu: <span className="whitespace-pre-line">{c.adresse}</span>,
    },
    c?.telephone && {
      icone: IconPhone,
      titre: t('contact.telephone'),
      contenu: (
        <a href={`tel:${c.telephone.replace(/[^+\d]/g, '')}`} className="hover:underline">
          {c.telephone}
        </a>
      ),
    },
    c?.email && {
      icone: IconMail,
      titre: t('contact.email'),
      contenu: (
        <a href={`mailto:${c.email}`} className="hover:underline">
          {c.email}
        </a>
      ),
    },
    c?.horaires && { icone: IconClock, titre: t('contact.horaires'), contenu: c.horaires },
  ].filter(Boolean) as { icone: typeof IconPin; titre: string; contenu: React.ReactNode }[]

  return (
    <>
      <PageHeader
        titre={t('contact.titre')}
        intro={t('contact.intro')}
        crumbs={[{ label: t('commun.accueil'), href: '/' }, { label: t('nav.contact') }]}
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-[var(--radius-carte)] bg-white p-6 shadow-[var(--shadow-carte)] ring-1 ring-nuit-100 sm:p-8">
            <ContactForm />
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="rounded-[var(--radius-carte)] bg-nuit-950 p-8 text-white">
            <h2 className="text-xl font-bold text-white">{t('contact.coordonnees')}</h2>
            <dl className="mt-6 space-y-5">
              {lignes.map(({ icone: Icone, titre, contenu }) => (
                <div key={titre} className="flex gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-iama-400">
                    <Icone />
                  </span>
                  <div>
                    <dt className="text-sm text-nuit-200">{titre}</dt>
                    <dd className="font-medium">{contenu}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-6 overflow-hidden rounded-[var(--radius-carte)] ring-1 ring-nuit-100">
            {/* Carte OpenStreetMap (sans cookie) centrée sur l'aéroport international Modibo-Keïta */}
            <iframe
              title={t('contact.carte')}
              className="aspect-[4/3] w-full"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-8.0,12.52,-7.92,12.56&layer=mapnik&marker=12.5355,-7.9473"
            />
          </div>
          {c?.carteUrl && (
            <a
              href={c.carteUrl}
              className="mt-3 inline-block text-sm font-semibold text-iama-700 hover:underline"
              target="_blank"
              rel="noopener"
            >
              {t('contact.carte')} ↗
            </a>
          )}
        </aside>
      </Container>
    </>
  )
}
