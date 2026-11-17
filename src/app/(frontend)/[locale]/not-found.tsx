import { useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  const t = useTranslations('commun')
  return (
    <Container className="py-24 text-center">
      <p className="text-6xl font-extrabold text-iama-500">404</p>
      <h1 className="mt-4 text-3xl font-bold">{t('pageIntrouvable')}</h1>
      <ButtonLink href="/" className="mt-8">
        {t('retourAccueil')}
      </ButtonLink>
    </Container>
  )
}
