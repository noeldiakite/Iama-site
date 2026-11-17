import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidateCollection } from '../hooks/revalidate'

/** Métiers de l'aérien préparés par l'IAMA (agent d'escale, de piste, de sûreté…). */
export const Metiers: CollectionConfig = {
  slug: 'metiers',
  labels: { singular: 'Métier', plural: 'Métiers' },
  admin: { useAsTitle: 'titre', group: 'Formations', defaultColumns: ['titre', 'ordre'] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: 'ordre',
  hooks: { afterChange: [revalidateCollection('metiers')] },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true },
    { name: 'description', label: 'Description', type: 'textarea', localized: true },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
    {
      name: 'ordre',
      label: 'Ordre',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
}
