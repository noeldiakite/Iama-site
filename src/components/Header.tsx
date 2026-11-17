'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { IconClose, IconMenu } from './Icons'
import { Logo } from './Logo'
import { buttonClass } from './ui/Button'
import { Container } from './ui/Container'

const NAV = [
  { href: '/formations', key: 'formations' },
  { href: '/institut', key: 'institut' },
  { href: '/accreditations', key: 'accreditations' },
  { href: '/metiers', key: 'metiers' },
  { href: '/actualites', key: 'actualites' },
  { href: '/contact', key: 'contact' },
] as const

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [ouvert, setOuvert] = useState(false)

  // Referme le menu mobile après un changement de page.
  const [cheminPrecedent, setCheminPrecedent] = useState(pathname)
  if (pathname !== cheminPrecedent) {
    setCheminPrecedent(pathname)
    setOuvert(false)
  }

  const actif = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-40 border-b border-nuit-100 bg-white/95 backdrop-blur">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        {t('evitement')}
      </a>
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" aria-label={`IAMA — ${t('accueil')}`}>
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={actif(item.href) ? 'page' : undefined}
                  className="rounded-full px-3 py-2 text-sm font-medium text-nuit-800 hover:bg-nuit-50 hover:text-nuit-950 aria-[current=page]:text-iama-700"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} pathname={pathname} label={t('langue')} />
          <Link
            href="/inscription"
            className={buttonClass('primaire', 'md', 'hidden sm:inline-flex')}
          >
            {t('inscription')}
          </Link>
          <button
            type="button"
            className="rounded-full p-2 text-nuit-900 hover:bg-nuit-50 lg:hidden"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            onClick={() => setOuvert((v) => !v)}
          >
            <span className="sr-only">{ouvert ? t('fermer') : t('menu')}</span>
            {ouvert ? <IconClose width={24} height={24} /> : <IconMenu width={24} height={24} />}
          </button>
        </div>
      </Container>

      {ouvert && (
        <nav
          id="menu-mobile"
          aria-label="Navigation principale"
          className="border-t border-nuit-100 bg-white lg:hidden"
        >
          <Container className="py-4">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={actif(item.href) ? 'page' : undefined}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-nuit-900 hover:bg-nuit-50 aria-[current=page]:bg-iama-50 aria-[current=page]:text-iama-700"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/inscription" className={buttonClass('primaire', 'lg', 'mt-4 w-full')}>
              {t('inscription')}
            </Link>
          </Container>
        </nav>
      )}
    </header>
  )
}

function LanguageSwitcher({
  locale,
  pathname,
  label,
}: {
  locale: string
  pathname: string
  label: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex rounded-full bg-nuit-50 p-0.5 text-xs font-bold"
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          className="rounded-full px-2.5 py-1.5 text-nuit-700 uppercase hover:text-nuit-950 aria-[current=true]:bg-white aria-[current=true]:text-nuit-950 aria-[current=true]:shadow-sm"
        >
          {l}
        </Link>
      ))}
    </div>
  )
}
