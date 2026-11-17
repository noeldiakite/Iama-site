import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'

/** Domaines de formation : filtre principal du catalogue (F3). */
export const Domaines: CollectionConfig = {
  slug: 'domaines',
  labels: { singular: 'Domaine', plural: 'Domaines de formation' },
  admin: { useAsTitle: 'titre', group: 'Formations', defaultColumns: ['titre', 'ordre'] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: 'ordre',
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true },
    { name: 'description', label: 'Description', type: 'textarea', localized: true },
    { name: 'ordre', label: 'Ordre d’affichage', type: 'number', defaultValue: 0 },
    slugField(),
  ],
}
