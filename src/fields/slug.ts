import type { Field, FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const source = data?.[fallback] ?? originalDoc?.[fallback]
    if (typeof source === 'string') return slugify(source)
    if (source && typeof source === 'object' && 'fr' in source) return slugify(String(source.fr))
    return value
  }

/**
 * Champ « slug » commun (adresse lisible). Généré depuis le titre français s'il est vide.
 * Le slug n'est pas traduit : /fr/formations/guidage-avion et /en/formations/guidage-avion.
 */
export const slugField = (fallback = 'titre'): Field => ({
  name: 'slug',
  label: 'Adresse (slug)',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Partie de l’adresse web. Laisser vide pour la générer depuis le titre.',
  },
  hooks: { beforeValidate: [formatSlug(fallback)] },
})
