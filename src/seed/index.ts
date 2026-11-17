/**
 * Reprise des contenus du site actuel et données de démonstration.
 *
 *   pnpm seed            → remplit une base vide (refuse si des formations existent déjà)
 *   pnpm seed --force    → vide les collections de contenu puis les remplit à nouveau
 *
 * Crée aussi un compte administrateur à partir de SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
 */
import 'dotenv/config'
import path from 'path'
import { getPayload, type CollectionSlug } from 'payload'
import { fileURLToPath } from 'url'
import config from '../payload.config'
import {
  accreditations,
  actualites,
  confidentialite,
  domaines,
  formations,
  institut,
  metiers,
  partenaires,
} from './donnees'
import { lexical } from './lexical'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const force = process.argv.includes('--force')
const ctx = { disableRevalidate: true, disableNotifications: true }

const payload = await getPayload({ config })

const existantes = await payload.count({ collection: 'formations' })
if (existantes.totalDocs > 0 && !force) {
  payload.logger.warn(
    'La base contient déjà des formations. Relancer avec --force pour tout remplacer.',
  )
  process.exit(0)
}

if (force) {
  const aVider: CollectionSlug[] = [
    'inscriptions',
    'messages-contact',
    'formations',
    'domaines',
    'metiers',
    'actualites',
    'accreditations',
    'partenaires',
    'pages',
    'formateurs',
    'media',
  ]
  for (const collection of aVider)
    await payload.delete({ collection, where: { id: { exists: true } }, context: ctx })
  payload.logger.info('Collections de contenu vidées.')
}

// --- Compte administrateur ---
const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD
if (email && password) {
  const deja = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (!deja.docs.length) {
    await payload.create({
      collection: 'users',
      data: { email, password, nom: 'Administrateur', roles: ['admin'] },
    })
    payload.logger.info(`Compte administrateur créé : ${email}`)
  }
}

// --- Médias ---
const medias = new Map<string, number>()
const media = async (fichier: string, alt: { fr: string; en: string }) => {
  if (medias.has(fichier)) return medias.get(fichier)!
  const doc = await payload.create({
    collection: 'media',
    data: { alt: alt.fr },
    filePath: path.resolve(dirname, 'medias', fichier),
    locale: 'fr',
    context: ctx,
  })
  await payload.update({
    collection: 'media',
    id: doc.id,
    data: { alt: alt.en },
    locale: 'en',
    context: ctx,
  })
  medias.set(fichier, doc.id)
  return doc.id
}

/** Crée un document en français puis ajoute sa version anglaise. */
const bilingue = async <T extends CollectionSlug>(
  collection: T,
  fr: Record<string, unknown>,
  en: Record<string, unknown>,
) => {
  const doc = await payload.create({ collection, data: fr as never, locale: 'fr', context: ctx })
  await payload.update({ collection, id: doc.id, data: en as never, locale: 'en', context: ctx })
  return doc.id as number
}

// --- Domaines et métiers ---
const idDomaine: Record<string, number> = {}
for (const d of domaines)
  idDomaine[d.cle] = await bilingue(
    'domaines',
    { titre: d.titre.fr, ordre: d.ordre, slug: d.cle },
    { titre: d.titre.en },
  )

const idMetier: Record<string, number> = {}
for (const m of metiers)
  idMetier[m.cle] = await bilingue(
    'metiers',
    { titre: m.titre.fr, description: m.description.fr, ordre: m.ordre, slug: m.cle },
    { titre: m.titre.en, description: m.description.en },
  )

// --- Formations ---
for (const f of formations) {
  const image = await media(f.image, { fr: f.fr.titre, en: f.en.titre })
  const contenu = (c: typeof f.fr) => ({
    titre: c.titre,
    resume: c.resume,
    description: lexical(c.description),
    objectifs: c.objectifs.map((texte) => ({ texte })),
    public: c.public,
    prerequis: c.prerequis,
    programme: c.programme ? lexical(c.programme) : undefined,
    methodes: c.methodes,
    evaluation: c.evaluation,
    validite: c.validite,
  })
  const doc = await payload.create({
    collection: 'formations',
    locale: 'fr',
    context: ctx,
    data: {
      ...contenu(f.fr),
      _status: 'published',
      slug: f.slug,
      image,
      domaine: idDomaine[f.domaine],
      type: f.type,
      modalites: ['presentiel'],
      dureeJours: f.dureeJours,
      dureeHeures: f.dureeHeures,
      prix: f.prix,
      enVedette: f.enVedette ?? false,
      ordre: f.ordre,
      metiers: f.metiers.map((m) => idMetier[m]),
      sessions: f.sessions.map((s) => ({
        dateDebut: s.debut,
        dateFin: s.fin,
        lieu: 'IAMA, Bamako',
        placesTotal: s.places,
        placesRestantes: s.restantes,
        statut: 'ouverte' as const,
      })),
    },
  })
  // Les tableaux localisés (objectifs) et non localisés (sessions) gardent leurs identifiants.
  await payload.update({
    collection: 'formations',
    id: doc.id,
    locale: 'en',
    context: ctx,
    data: { ...contenu(f.en), _status: 'published' },
  })
}
payload.logger.info(`${formations.length} formations importées.`)

// --- Actualités ---
for (const a of actualites) {
  const image = await media(a.image, { fr: a.fr.titre, en: a.en.titre })
  await bilingue(
    'actualites',
    {
      titre: a.fr.titre,
      extrait: a.fr.texte.slice(0, 280),
      contenu: lexical(a.fr.texte),
      date: a.date,
      image,
      slug: a.slug,
      _status: 'published',
    },
    {
      titre: a.en.titre,
      extrait: a.en.texte.slice(0, 280),
      contenu: lexical(a.en.texte),
      _status: 'published',
    },
  )
}
for (const [fichier, fr, en, date] of [
  [
    'visite-pca.jpg',
    'Visite du PCA à l’IAMA',
    'Visit of the Chairman of the Board to IAMA',
    '2025-07-02',
  ],
  ['presentation-fret.jpg', 'Présentation au fret', 'Introduction to cargo', '2024-10-31'],
] as const) {
  const image = await media(fichier, { fr, en })
  await bilingue(
    'actualites',
    { titre: fr, date, image, _status: 'published', extrait: 'Article à compléter par l’IAMA.' },
    { titre: en, _status: 'published', extrait: 'Article to be completed by IAMA.' },
  )
}

// --- Accréditations, partenaires ---
for (const a of accreditations) {
  const image = await media(a.image, { fr: a.fr, en: a.en })
  await bilingue(
    'accreditations',
    { titre: a.fr, organisme: a.organisme, ordre: a.ordre, image },
    { titre: a.en },
  )
}
for (const p of partenaires) {
  const logo = await media(p.logo, { fr: `Logo ${p.nom}`, en: `${p.nom} logo` })
  await payload.create({
    collection: 'partenaires',
    data: { nom: p.nom, logo, ordre: p.ordre, actionnaire: true },
    context: ctx,
  })
}

// --- Pages ---
const batiment = await media('batiment-iama.jpg', {
  fr: 'Le bâtiment de l’IAMA à l’aéroport de Bamako-Sénou',
  en: 'IAMA building at Bamako-Sénou airport',
})
await bilingue(
  'pages',
  {
    titre: institut.fr.titre,
    chapeau: institut.fr.chapeau,
    contenu: lexical(institut.fr.contenu),
    image: batiment,
    slug: 'institut',
    _status: 'published',
  },
  {
    titre: institut.en.titre,
    chapeau: institut.en.chapeau,
    contenu: lexical(institut.en.contenu),
    _status: 'published',
  },
)
await bilingue(
  'pages',
  {
    titre: confidentialite.fr.titre,
    contenu: lexical(confidentialite.fr.contenu),
    slug: 'confidentialite',
    _status: 'published',
  },
  {
    titre: confidentialite.en.titre,
    contenu: lexical(confidentialite.en.contenu),
    _status: 'published',
  },
)
await bilingue(
  'pages',
  {
    titre: 'Mentions légales',
    contenu: lexical(
      'Éditeur : Institut Africain des Métiers de l’Aérien (IAMA), SA de droit malien.\nTexte à compléter par l’IAMA (RCCM, directeur de publication, hébergeur).',
    ),
    slug: 'mentions-legales',
    _status: 'published',
  },
  {
    titre: 'Legal notice',
    contenu: lexical(
      'Publisher: African Institute of Aviation Professions (IAMA), Malian public limited company.\nText to be completed by IAMA.',
    ),
    _status: 'published',
  },
)

// --- Paramètres du site ---
await payload.updateGlobal({
  slug: 'parametres',
  locale: 'fr',
  context: ctx,
  data: {
    contact: {
      adresse: 'Zone aéroportuaire de Sénou\nAéroport international Modibo-Keïta, Bamako, Mali',
      telephone: '+223 83 00 40 40',
      email: 'info@iama.aero',
      horaires: 'Du lundi au vendredi, de 8 h à 17 h (à confirmer)',
    },
    accroche: 'Formez-vous aux métiers de l’aérien',
    sousTitre:
      'Centre agréé par l’ANAC Mali et accrédité IATA, l’IAMA prépare depuis 2005 les professionnels de l’assistance en escale, de la sûreté et du fret.',
    // Chiffres indicatifs (« plus de 300 stages par an » sur le site actuel) : à confirmer par l'IAMA.
    chiffresCles: [
      { valeur: '2005', libelle: 'Année de création' },
      { valeur: '300+', libelle: 'Stages dispensés chaque année' },
      { valeur: 'ANAC', libelle: 'Centre agréé' },
      { valeur: 'IATA', libelle: 'Centre accrédité' },
    ],
    emailNotifications: 'info@iama.aero',
  },
})
const p = await payload.findGlobal({ slug: 'parametres', locale: 'fr' })
await payload.updateGlobal({
  slug: 'parametres',
  locale: 'en',
  context: ctx,
  data: {
    contact: {
      ...p.contact,
      adresse: 'Sénou airport area\nModibo-Keïta International Airport, Bamako, Mali',
      horaires: 'Monday to Friday, 8 am to 5 pm (to be confirmed)',
    },
    accroche: 'Train for a career in aviation',
    sousTitre:
      'ANAC Mali-approved and IATA-accredited, IAMA has been training ground handling, security and cargo professionals since 2005.',
    chiffresCles: (p.chiffresCles ?? []).map((c, i) => ({
      ...c,
      libelle: ['Founded', 'Courses delivered every year', 'Approved centre', 'Accredited centre'][
        i
      ],
    })),
  },
})

payload.logger.info('Reprise des contenus terminée.')
process.exit(0)
