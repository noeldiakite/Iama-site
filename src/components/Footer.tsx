import { getTranslations } from 'next-intl/server'
import type { Parametre } from '@/payload-types'
import { Link } from '@/i18n/navigation'
import { IconMail, IconPhone, IconPin } from './Icons'
import { Logo } from './Logo'
import { Container } from './ui/Container'

export async function Footer({ parametres }: { parametres: Parametre | null }) {
  const t = await getTranslations()
  const c = parametres?.contact
  return (
    <footer className="bg-nuit-950 text-nuit-100">
      <Container className="grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo inverse />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-nuit-200">
            {t('footer.apropos')}
          </p>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">
            {t('footer.liens')}
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(
              [
                ['/formations', 'nav.formations'],
                ['/inscription', 'nav.inscription'],
                ['/accreditations', 'nav.accreditations'],
                ['/formateurs', 'nav.formateurs'],
                ['/actualites', 'nav.actualites'],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white hover:underline">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">
            {t('contact.coordonnees')}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {c?.adresse && (
              <li className="flex gap-3">
                <IconPin className="mt-0.5 shrink-0 text-iama-400" />
                <span className="whitespace-pre-line">{c.adresse}</span>
              </li>
            )}
            {c?.telephone && (
              <li className="flex gap-3">
                <IconPhone className="mt-0.5 shrink-0 text-iama-400" />
                <a href={`tel:${c.telephone.replace(/[^+\d]/g, '')}`} className="hover:text-white">
                  {c.telephone}
                </a>
              </li>
            )}
            {c?.email && (
              <li className="flex gap-3">
                <IconMail className="mt-0.5 shrink-0 text-iama-400" />
                <a href={`mailto:${c.email}`} className="hover:text-white">
                  {c.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-nuit-200 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} IAMA. {t('footer.droits')}
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/confidentialite" className="hover:text-white hover:underline">
                {t('footer.confidentialite')}
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-white hover:underline">
                {t('footer.mentions')}
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  )
}
