import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath } from 'next/cache'

const LOCALES = ['fr', 'en']

const safeRevalidate = (paths: string[]) => {
  for (const p of paths) {
    try {
      revalidatePath(p)
    } catch {
      // Hors contexte Next.js (script de seed par exemple) : rien à invalider.
    }
  }
}

/**
 * Invalide le cache des pages publiques après une modification dans le back-office,
 * pour que les pages générées à l'avance (F8) restent à jour.
 */
export const revalidateCollection =
  (base: string): CollectionAfterChangeHook =>
  ({ doc, req }) => {
    if (req.context?.disableRevalidate) return doc
    const paths = LOCALES.flatMap((l) => [
      `/${l}`,
      `/${l}/${base}`,
      doc?.slug ? `/${l}/${base}/${doc.slug}` : null,
    ]).filter(Boolean) as string[]
    safeRevalidate(paths)
    return doc
  }

export const revalidateCollectionDelete =
  (base: string): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    if (req.context?.disableRevalidate) return doc
    safeRevalidate(LOCALES.flatMap((l) => [`/${l}`, `/${l}/${base}`]))
    return doc
  }

export const revalidateEverything: GlobalAfterChangeHook = ({ doc, req }) => {
  if (req.context?.disableRevalidate) return doc
  try {
    revalidatePath('/', 'layout')
  } catch {
    // ignoré hors Next.js
  }
  return doc
}
