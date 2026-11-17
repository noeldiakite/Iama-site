import { getTranslations } from 'next-intl/server'
import type { Formation } from '@/payload-types'
import { FormationCardView } from './FormationCardView'

export async function FormationCard({
  formation,
  locale,
}: {
  formation: Formation
  locale: string
}) {
  const t = await getTranslations('formation')
  return (
    <FormationCardView
      formation={formation}
      locale={locale}
      labels={{
        surDevis: t('surDevis'),
        jours: formation.dureeJours ? t('jours', { count: formation.dureeJours }) : null,
        voir: t('enSavoirPlus'),
        type: formation.type ? t(`types.${formation.type}`) : null,
      }}
    />
  )
}
