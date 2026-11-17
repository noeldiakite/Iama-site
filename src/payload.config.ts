import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Accreditations } from './collections/Accreditations'
import { Actualites } from './collections/Actualites'
import { Domaines } from './collections/Domaines'
import { Formateurs } from './collections/Formateurs'
import { Formations } from './collections/Formations'
import { Inscriptions } from './collections/Inscriptions'
import { Media } from './collections/Media'
import { MessagesContact } from './collections/MessagesContact'
import { Metiers } from './collections/Metiers'
import { Pages } from './collections/Pages'
import { Partenaires } from './collections/Partenaires'
import { Users } from './collections/Users'
import { Parametres } from './globals/Parametres'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// E-mails : SMTP si configuré (Brevo, Resend, serveur IAMA…), sinon affichage dans les journaux.
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@iama.aero',
      defaultFromName: 'IAMA',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — IAMA administration' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  // Back-office en français (F6), anglais disponible pour un éventuel prestataire.
  i18n: { supportedLanguages: { fr, en }, fallbackLanguage: 'fr' },
  // Contenus bilingues (F1) : chaque champ « localized » existe en français et en anglais.
  localization: {
    locales: [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  collections: [
    Formations,
    Domaines,
    Metiers,
    Formateurs,
    Inscriptions,
    MessagesContact,
    Actualites,
    Pages,
    Accreditations,
    Partenaires,
    Media,
    Users,
  ],
  globals: [Parametres],
  editor: lexicalEditor(),
  email,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // En développement, le schéma suit le code ; en préproduction/production (et en CI,
    // PAYLOAD_DB_PUSH=false), on passe uniquement par les migrations.
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DB_PUSH !== 'false',
    migrationDir: path.resolve(dirname, 'migrations'),
    // En production, les migrations en attente s'appliquent au démarrage du serveur.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    // Export CSV des inscriptions (F5)
    importExportPlugin({
      collections: [{ slug: 'inscriptions' }, { slug: 'messages-contact' }],
    }),
  ],
})
