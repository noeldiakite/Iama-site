import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { SITE_URL } from '@/lib/seo'

export const revalidate = 3600

/** Plan du site bilingue (F10), avec les variantes de langue de chaque page. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statiques = [
    '',
    '/formations',
    '/institut',
    '/accreditations',
    '/metiers',
    '/formateurs',
    '/actualites',
    '/contact',
    '/inscription',
  ]
  let dynamiques: { path: string; lastModified?: string }[] = []
  try {
    const payload = await getPayloadClient()
    const publie = { _status: { equals: 'published' } } as const
    const [formations, actualites, pages] = await Promise.all([
      payload.find({
        collection: 'formations',
        where: publie,
        limit: 500,
        depth: 0,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'actualites',
        where: publie,
        limit: 500,
        depth: 0,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'pages',
        where: publie,
        limit: 100,
        depth: 0,
        select: { slug: true, updatedAt: true },
      }),
    ])
    dynamiques = [
      ...formations.docs.map((d) => ({ path: `/formations/${d.slug}`, lastModified: d.updatedAt })),
      ...actualites.docs.map((d) => ({ path: `/actualites/${d.slug}`, lastModified: d.updatedAt })),
      ...pages.docs
        .filter((d) => d.slug !== 'institut')
        .map((d) => ({ path: `/${d.slug}`, lastModified: d.updatedAt })),
    ]
  } catch {
    // Base indisponible (build sans base) : plan du site limité aux pages fixes.
  }
  const toutes: { path: string; lastModified?: string }[] = [
    ...statiques.map((path) => ({ path })),
    ...dynamiques,
  ]
  return toutes.flatMap(({ path, lastModified }) =>
    routing.locales.map((l) => ({
      url: `${SITE_URL}/${l}${path}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((x) => [x, `${SITE_URL}/${x}${path}`])),
      },
    })),
  )
}
