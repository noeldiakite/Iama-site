import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { routing } from '@/i18n/routing'
import { getParametres } from '@/lib/queries'
import { alternates, isPreprod, SITE_URL } from '@/lib/seo'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('siteName'), template: `%s | IAMA` },
    description: t('description'),
    alternates: alternates(locale),
    openGraph: { siteName: 'IAMA', locale: locale === 'fr' ? 'fr_FR' : 'en_GB', type: 'website' },
    robots: isPreprod ? { index: false, follow: false } : undefined,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const [messages, parametres] = await Promise.all([getMessages(), getParametres(locale)])

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer parametres={parametres} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
