import type { Access, FieldAccess } from 'payload'

type MaybeUser = { roles?: string[] | null } | null | undefined

export const isAdmin = (user: MaybeUser): boolean => Boolean(user?.roles?.includes('admin'))

/** Tout utilisateur connecté au back-office (administrateur ou éditeur). */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const adminOnly: Access = ({ req: { user } }) => isAdmin(user as MaybeUser)

export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdmin(user as MaybeUser)

/** Lecture publique des contenus publiés ; les brouillons restent visibles des seuls utilisateurs connectés. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const anyone: Access = () => true
