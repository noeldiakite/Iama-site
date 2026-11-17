import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Partenaires: CollectionConfig = {
  slug: 'partenaires',
  labels: { singular: 'Partenaire', plural: 'Partenaires' },
  admin: { useAsTitle: 'nom', group: 'Contenus', defaultColumns: ['nom', 'ordre'] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: 'ordre',
  hooks: { afterChange: [revalidateCollection('partenaires')] },
  fields: [
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    { name: 'url', label: 'Site web', type: 'text' },
    { name: 'actionnaire', label: 'Actionnaire de l’IAMA', type: 'checkbox', defaultValue: false },
    {
      name: 'ordre',
      label: 'Ordre',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
