import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Redirige / vers /fr (ou /en selon le navigateur) et gère le préfixe de langue.
export default createMiddleware(routing)

export const config = {
  // Exclut le back-office Payload, l'API, les fichiers statiques et internes de Next.js.
  matcher: ['/((?!api|admin|_next|_vercel|images|favicon|robots.txt|sitemap.xml|.*\\..*).*)'],
}
