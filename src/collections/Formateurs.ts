import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidateCollection } from '../hooks/revalidate'

export const Formateurs: CollectionConfig = {
  slug: 'formateurs',
  labels: { singular: 'Formateur', plural: 'Formateurs' },
  admin: { useAsTitle: 'nom', group: 'Formations', defaultColumns: ['nom', 'fonction'] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [revalidateCollection('formateurs')] },
  fields: [
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'fonction', label: 'Fonction', type: 'text', localized: true },
    { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media' },
    { name: 'biographie', label: 'Biographie', type: 'textarea', localized: true },
    {
      name: 'expertises',
      label: 'Expertises',
      type: 'array',
      localized: true,
      fields: [{ name: 'texte', label: 'Expertise', type: 'text', required: true }],
    },
    slugField('nom'),
  ],
}
