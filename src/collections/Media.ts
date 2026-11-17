import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: { group: 'Contenus' },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texte alternatif',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Décrit l’image pour les personnes malvoyantes (accessibilité WCAG).' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'vignette', width: 480, height: 320, position: 'centre' },
      { name: 'carte', width: 800, height: 520, position: 'centre' },
      { name: 'large', width: 1600 },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
    focalPoint: true,
  },
}
