import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Catalogue } from '@/components/Catalogue'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Locale } from '@/i18n/routing'
import { getDomaines, getFormations } from '@/lib/queries'
import { alternates } from '@/lib/seo'

export const revalidate = 600

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalogue' })
  return {
    title: t('titre'),
    description: t('intro'),
    alternates: alternates(locale, '/formations'),
  }
}

export default async function CataloguePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const [formations, domaines] = await Promise.all([getFormations(locale), getDomaines(locale)])
  return (
    <>
      <PageHeader
        titre={t('catalogue.titre')}
        intro={t('catalogue.intro')}
        crumbs={[{ label: t('commun.accueil'), href: '/' }, { label: t('nav.formations') }]}
      />
      <section className="bg-sable-50 py-12">
        <Container>
          <Catalogue formations={formations} domaines={domaines} />
        </Container>
      </section>
    </>
  )
}
