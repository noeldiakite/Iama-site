import type { MetadataRoute } from 'next'
import { isPreprod, SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  if (isPreprod) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/fr/charte', '/en/charte'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
