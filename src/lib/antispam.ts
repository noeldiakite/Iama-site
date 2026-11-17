import { headers } from 'next/headers'

const fenetreMs = 10 * 60 * 1000
const maxParFenetre = 5
const compteurs = new Map<string, number[]>()

/**
 * Limite simple du nombre d'envois par adresse IP (en mémoire, un seul processus).
 * Complétée côté serveur par la limitation de Nginx (voir deploy/nginx).
 */
export async function verifierLimite(cle: string): Promise<boolean> {
  const h = await headers()
  const ip = h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnue'
  const k = `${cle}:${ip}`
  const now = Date.now()
  const recents = (compteurs.get(k) ?? []).filter((t) => now - t < fenetreMs)
  if (recents.length >= maxParFenetre) return false
  recents.push(now)
  compteurs.set(k, recents)
  if (compteurs.size > 5000) compteurs.clear()
  return true
}

/** Le champ piège a été rempli, ou le formulaire a été envoyé trop vite pour un humain. */
export function estRobot(form: FormData): boolean {
  if (String(form.get('site_web') ?? '').length > 0) return true
  const debut = Number(form.get('_t'))
  return Number.isFinite(debut) && debut > 0 && Date.now() - debut < 2500
}
