import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoFields } from '../fields/seo'
import { revalidateCollection } from '../hooks/revalidate'

/** Pages de contenu libre : présentation, politique de confidentialité, mentions légales… */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: { useAsTitle: 'titre', group: 'Contenus', defaultColumns: ['titre', 'slug', '_status'] },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: { afterChange: [revalidateCollection('pages')] },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true },
    { name: 'chapeau', label: 'Chapeau', type: 'textarea', localized: true },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
    { name: 'contenu', label: 'Contenu', type: 'richText', localized: true },
    slugField(),
    seoFields,
  ],
}
