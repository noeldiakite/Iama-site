'use server'

import { getTranslations } from 'next-intl/server'
import { estRobot, verifierLimite } from '@/lib/antispam'
import { getPayloadClient } from '@/lib/payload'
import { formatPeriode } from '@/lib/format'

export type EtatFormulaire = {
  ok: boolean
  message?: string
  erreurs?: Record<string, string>
  reference?: string
  valeurs?: Record<string, string>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TEL = /^[+()\d\s.-]{8,20}$/
const txt = (form: FormData, k: string, max = 200) =>
  String(form.get(k) ?? '')
    .trim()
    .slice(0, max)

export async function soumettreInscription(
  _prev: EtatFormulaire,
  form: FormData,
): Promise<EtatFormulaire> {
  const locale = txt(form, 'locale', 2) === 'en' ? 'en' : 'fr'
  const t = await getTranslations({ locale, namespace: 'formulaire' })
  const valeurs = Object.fromEntries(
    [
      'formation',
      'session',
      'civilite',
      'nom',
      'prenom',
      'email',
      'telephone',
      'organisation',
      'fonction',
      'message',
    ].map((k) => [k, txt(form, k, 2000)]),
  )

  // Robot : on répond « succès » sans rien enregistrer.
  if (estRobot(form)) return { ok: true, reference: '—' }
  if (!(await verifierLimite('inscription')))
    return { ok: false, message: t('tropDeRequetes'), valeurs }

  const erreurs: Record<string, string> = {}
  for (const k of ['formation', 'nom', 'prenom', 'email', 'telephone'])
    if (!valeurs[k]) erreurs[k] = t('champRequis')
  if (valeurs.email && !EMAIL.test(valeurs.email)) erreurs.email = t('emailInvalide')
  if (valeurs.telephone && !TEL.test(valeurs.telephone)) erreurs.telephone = t('telephoneInvalide')
  if (form.get('consentement') !== 'on') erreurs.consentement = t('consentementRequis')
  if (Object.keys(erreurs).length)
    return { ok: false, message: t('erreurGenerale'), erreurs, valeurs }

  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'formations',
      where: { slug: { equals: valeurs.formation }, _status: { equals: 'published' } },
      limit: 1,
      locale,
      depth: 0,
    })
    const formation = res.docs[0]
    if (!formation)
      return {
        ok: false,
        message: t('erreurGenerale'),
        erreurs: { formation: t('champRequis') },
        valeurs,
      }

    const session = formation.sessions?.find((s) => s.id === valeurs.session)
    const doc = await payload.create({
      collection: 'inscriptions',
      overrideAccess: true,
      data: {
        formation: formation.id,
        sessionId: session?.id ?? undefined,
        sessionLibelle: session
          ? `${formatPeriode(session.dateDebut, session.dateFin, 'fr')} — ${session.lieu ?? ''}`
          : 'Prochaine session disponible',
        civilite: (['M.', 'Mme'].includes(valeurs.civilite) ? valeurs.civilite : undefined) as
          'M.' | 'Mme' | undefined,
        nom: valeurs.nom,
        prenom: valeurs.prenom,
        email: valeurs.email,
        telephone: valeurs.telephone,
        organisation: valeurs.organisation || undefined,
        fonction: valeurs.fonction || undefined,
        message: valeurs.message || undefined,
        consentement: true,
        langue: locale,
      },
    })
    return { ok: true, reference: doc.reference ?? undefined }
  } catch (err) {
    console.error('Inscription', err)
    return { ok: false, message: t('erreurServeur'), valeurs }
  }
}

export async function envoyerContact(
  _prev: EtatFormulaire,
  form: FormData,
): Promise<EtatFormulaire> {
  const locale = txt(form, 'locale', 2) === 'en' ? 'en' : 'fr'
  const t = await getTranslations({ locale, namespace: 'formulaire' })
  const valeurs = Object.fromEntries(
    ['nom', 'email', 'telephone', 'organisation', 'sujet', 'message'].map((k) => [
      k,
      txt(form, k, k === 'message' ? 5000 : 200),
    ]),
  )

  if (estRobot(form)) return { ok: true }
  if (!(await verifierLimite('contact')))
    return { ok: false, message: t('tropDeRequetes'), valeurs }

  const erreurs: Record<string, string> = {}
  for (const k of ['nom', 'email', 'sujet', 'message'])
    if (!valeurs[k]) erreurs[k] = t('champRequis')
  if (valeurs.email && !EMAIL.test(valeurs.email)) erreurs.email = t('emailInvalide')
  if (valeurs.telephone && !TEL.test(valeurs.telephone)) erreurs.telephone = t('telephoneInvalide')
  if (form.get('consentement') !== 'on') erreurs.consentement = t('consentementRequis')
  if (Object.keys(erreurs).length)
    return { ok: false, message: t('erreurGenerale'), erreurs, valeurs }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'messages-contact',
      overrideAccess: true,
      data: {
        nom: valeurs.nom,
        email: valeurs.email,
        telephone: valeurs.telephone || undefined,
        organisation: valeurs.organisation || undefined,
        sujet: valeurs.sujet,
        message: valeurs.message,
        consentement: true,
      },
    })
    return { ok: true }
  } catch (err) {
    console.error('Contact', err)
    return { ok: false, message: t('erreurServeur'), valeurs }
  }
}
