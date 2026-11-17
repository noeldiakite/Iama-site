import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** Balises hreflang (F10) et adresse canonique pour un chemin sans préfixe de langue. */
export const alternates = (locale: string, path = ''): Metadata['alternates'] => ({
  canonical: `${SITE_URL}/${locale}${path}`,
  languages: Object.fromEntries([
    ...routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    ['x-default', `${SITE_URL}/${routing.defaultLocale}${path}`],
  ]),
})

/** La préproduction ne doit pas être indexée par les moteurs de recherche. */
export const isPreprod = process.env.SITE_ENV === 'preprod'
