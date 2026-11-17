import type { Field } from 'payload'

/** Titre et description pour les moteurs de recherche (F10 — référencement de base). */
export const seoFields: Field = {
  name: 'seo',
  label: 'Référencement',
  type: 'group',
  admin: { position: 'sidebar' },
  fields: [
    { name: 'titre', label: 'Titre SEO', type: 'text', localized: true, maxLength: 70 },
    {
      name: 'description',
      label: 'Description SEO',
      type: 'textarea',
      localized: true,
      maxLength: 170,
    },
  ],
}
