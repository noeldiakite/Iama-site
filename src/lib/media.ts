import type { Media } from '@/payload-types'

export type MaybeMedia = number | Media | null | undefined

export const asMedia = (m: MaybeMedia): Media | null => (m && typeof m === 'object' ? m : null)

export const mediaUrl = (m: MaybeMedia, size?: 'vignette' | 'carte' | 'large'): string | null => {
  const media = asMedia(m)
  if (!media) return null
  return (size && media.sizes?.[size]?.url) || media.url || null
}
