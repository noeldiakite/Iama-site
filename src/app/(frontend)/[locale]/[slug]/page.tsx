import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Locale } from '@/i18n/routing'
import { getPage } from '@/lib/queries'
import { alternates } from '@/lib/seo'

/** Pages libres gérées dans le back-office (confidentialité, mentions légales…). */
export const revalidate = 600
type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getPage(locale, slug)
  if (!page) return {}
  return {
    title: page.seo?.titre || page.titre,
    description: page.seo?.description || page.chapeau || undefined,
    alternates: alternates(locale, `/${slug}`),
  }
}

export default async function PageLibre({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = await getPage(locale, slug)
  if (!page) notFound()
  const t = await getTranslations('commun')
  return (
    <>
      <PageHeader
        titre={page.titre}
        intro={page.chapeau}
        crumbs={[{ label: t('accueil'), href: '/' }, { label: page.titre }]}
      />
      <Container className="max-w-3xl py-12">
        <RichText data={page.contenu} />
      </Container>
    </>
  )
}
