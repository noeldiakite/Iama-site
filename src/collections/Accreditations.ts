import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

/** Agréments et certifications (ANAC, IATA), avec document PDF téléchargeable (F2). */
export const Accreditations: CollectionConfig = {
  slug: 'accreditations',
  labels: { singular: 'Accréditation', plural: 'Accréditations' },
  admin: {
    useAsTitle: 'titre',
    group: 'Contenus',
    defaultColumns: ['titre', 'organisme', 'ordre'],
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: 'ordre',
  hooks: { afterChange: [revalidateCollection('accreditations')] },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true },
    {
      name: 'organisme',
      label: 'Organisme',
      type: 'select',
      options: [
        { label: 'ANAC Mali', value: 'anac' },
        { label: 'IATA', value: 'iata' },
        { label: 'OACI', value: 'oaci' },
        { label: 'Autre', value: 'autre' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea', localized: true },
    { name: 'image', label: 'Aperçu', type: 'upload', relationTo: 'media' },
    {
      name: 'document',
      label: 'Document PDF',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { equals: 'application/pdf' } },
    },
    {
      name: 'ordre',
      label: 'Ordre',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
