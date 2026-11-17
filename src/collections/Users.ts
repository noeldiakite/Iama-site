import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, isAdmin } from '../access'

/**
 * Comptes du back-office. Deux rôles (F6) :
 * - administrateur : tout, y compris les comptes et les paramètres ;
 * - éditeur : contenus, formations, actualités et inscriptions.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['nom', 'email', 'roles'],
    group: 'Administration',
  },
  auth: {
    // F9 : blocage après tentatives de connexion répétées
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isAdmin(user)) return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (isAdmin(user)) return true
      return { id: { equals: user.id } }
    },
  },
  fields: [
    { name: 'nom', label: 'Nom complet', type: 'text' },
    {
      name: 'roles',
      label: 'Rôles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editeur'],
      saveToJWT: true,
      access: { create: adminOnlyField, update: adminOnlyField },
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Éditeur', value: 'editeur' },
      ],
    },
  ],
}
