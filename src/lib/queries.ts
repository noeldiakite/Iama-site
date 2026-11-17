import { draftMode } from 'next/headers'
import { cache } from 'react'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from './payload'

/**
 * Accès aux contenus depuis les pages publiques (API locale de Payload, sans appel réseau).
 * Les fonctions sont mémorisées pour la durée d'une requête.
 */

const isDraft = async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

export const getParametres = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'parametres', locale, depth: 1 }).catch(() => null)
})

export const getFormations = cache(
  async (locale: Locale, opts: { vedette?: boolean; limit?: number } = {}) => {
    const payload = await getPayloadClient()
    const draft = await isDraft()
    const res = await payload.find({
      collection: 'formations',
      locale,
      depth: 1,
      draft,
      limit: opts.limit ?? 100,
      sort: ['ordre', 'titre'],
      where: {
        ...(draft ? {} : { _status: { equals: 'published' } }),
        ...(opts.vedette ? { enVedette: { equals: true } } : {}),
      },
    })
    return res.docs
  },
)

export const getFormation = cache(async (locale: Locale, slug: string) => {
  const payload = await getPayloadClient()
  const draft = await isDraft()
  const res = await payload.find({
    collection: 'formations',
    locale,
    depth: 2,
    draft,
    limit: 1,
    where: { slug: { equals: slug }, ...(draft ? {} : { _status: { equals: 'published' } }) },
  })
  return res.docs[0] ?? null
})

export const getDomaines = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'domaines', locale, limit: 50, sort: 'ordre' })).docs
})

export const getMetiers = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'metiers', locale, limit: 50, sort: 'ordre', depth: 1 }))
    .docs
})

export const getActualites = cache(async (locale: Locale, limit = 24) => {
  const payload = await getPayloadClient()
  return (
    await payload.find({
      collection: 'actualites',
      locale,
      limit,
      sort: '-date',
      depth: 1,
      where: { _status: { equals: 'published' } },
    })
  ).docs
})

export const getActualite = cache(async (locale: Locale, slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'actualites',
    locale,
    limit: 1,
    depth: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return res.docs[0] ?? null
})

export const getPage = cache(async (locale: Locale, slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'pages',
    locale,
    limit: 1,
    depth: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return res.docs[0] ?? null
})

export const getAccreditations = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (
    await payload.find({ collection: 'accreditations', locale, limit: 20, sort: 'ordre', depth: 1 })
  ).docs
})

export const getPartenaires = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (
    await payload.find({ collection: 'partenaires', locale, limit: 30, sort: 'ordre', depth: 1 })
  ).docs
})

export const getFormateurs = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return (
    await payload.find({ collection: 'formateurs', locale, limit: 50, sort: 'nom', depth: 1 })
  ).docs
})
