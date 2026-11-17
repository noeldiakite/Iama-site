import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoFields } from '../fields/seo'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

export const Actualites: CollectionConfig = {
  slug: 'actualites',
  labels: { singular: 'Actualité', plural: 'Actualités' },
  admin: { useAsTitle: 'titre', group: 'Contenus', defaultColumns: ['titre', 'date', '_status'] },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-date',
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    afterChange: [revalidateCollection('actualites')],
    afterDelete: [revalidateCollectionDelete('actualites')],
  },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    { name: 'extrait', label: 'Extrait', type: 'textarea', localized: true, maxLength: 300 },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
    { name: 'contenu', label: 'Contenu', type: 'richText', localized: true },
    slugField(),
    seoFields,
  ],
}
