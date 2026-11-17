import type { CollectionAfterChangeHook, PayloadRequest } from 'payload'

const escape = (s: unknown) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )

const destinataireIAMA = async (req: PayloadRequest): Promise<string | undefined> => {
  try {
    const params = await req.payload.findGlobal({ slug: 'parametres', req, depth: 0 })
    return params?.emailNotifications || params?.contact?.email || process.env.EMAIL_NOTIFICATIONS
  } catch {
    return process.env.EMAIL_NOTIFICATIONS
  }
}

const envoyer = async (
  req: PayloadRequest,
  to: string | undefined,
  subject: string,
  html: string,
) => {
  if (!to) return
  try {
    await req.payload.sendEmail({ to, subject, html })
  } catch (err) {
    req.payload.logger.error({ err, msg: `Échec d'envoi de l'e-mail « ${subject} »` })
  }
}

/** Accusé de réception au candidat et notification à l'équipe IAMA (F5). */
export const notifierInscription: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create' || req.context?.disableNotifications) return doc
  const formation =
    typeof doc.formation === 'object'
      ? doc.formation
      : await req.payload.findByID({
          collection: 'formations',
          id: doc.formation,
          req,
          depth: 0,
          locale: doc.langue || 'fr',
        })
  const titre = escape(formation?.titre)
  const session = escape(doc.sessionLibelle || '—')
  const en = doc.langue === 'en'

  await envoyer(
    req,
    doc.email,
    en
      ? `IAMA: we have received your registration (${doc.reference})`
      : `IAMA : votre demande d’inscription est bien reçue (${doc.reference})`,
    en
      ? `<p>Dear ${escape(doc.prenom)} ${escape(doc.nom)},</p><p>We have received your registration request for <strong>${titre}</strong> (session: ${session}). Our team will contact you shortly to confirm your place.</p><p>Reference: <strong>${escape(doc.reference)}</strong></p><p>IAMA — Institut Africain des Métiers de l’Aérien</p>`
      : `<p>Bonjour ${escape(doc.prenom)} ${escape(doc.nom)},</p><p>Nous avons bien reçu votre demande d’inscription à la formation <strong>${titre}</strong> (session : ${session}). Notre équipe vous recontactera rapidement pour confirmer votre place.</p><p>Référence : <strong>${escape(doc.reference)}</strong></p><p>IAMA — Institut Africain des Métiers de l’Aérien</p>`,
  )

  await envoyer(
    req,
    await destinataireIAMA(req),
    `Nouvelle inscription ${doc.reference} — ${formation?.titre ?? ''}`,
    `<p>Nouvelle demande d’inscription reçue sur le site.</p>
     <ul>
       <li>Formation : ${titre}</li><li>Session : ${session}</li>
       <li>Candidat : ${escape(doc.civilite)} ${escape(doc.prenom)} ${escape(doc.nom)}</li>
       <li>E-mail : ${escape(doc.email)} — Téléphone : ${escape(doc.telephone)}</li>
       <li>Organisation : ${escape(doc.organisation)} — Fonction : ${escape(doc.fonction)}</li>
     </ul>
     <p>${escape(doc.message)}</p>
     <p>À traiter dans le back-office : ${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/admin/collections/inscriptions/${doc.id}</p>`,
  )
  return doc
}

export const notifierContact: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create' || req.context?.disableNotifications) return doc
  await envoyer(
    req,
    await destinataireIAMA(req),
    `Message du site : ${doc.sujet}`,
    `<p>De : ${escape(doc.nom)} &lt;${escape(doc.email)}&gt; ${escape(doc.telephone)}</p><p>Organisation : ${escape(doc.organisation)}</p><p>${escape(doc.message).replace(/\n/g, '<br>')}</p>`,
  )
  return doc
}
