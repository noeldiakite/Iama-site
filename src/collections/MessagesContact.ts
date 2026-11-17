import type { CollectionConfig } from 'payload'
import { adminOnly, authenticated } from '../access'
import { notifierContact } from '../hooks/notifications'

export const MessagesContact: CollectionConfig = {
  slug: 'messages-contact',
  labels: { singular: 'Message de contact', plural: 'Messages de contact' },
  admin: {
    useAsTitle: 'sujet',
    group: 'Inscriptions et contacts',
    defaultColumns: ['sujet', 'nom', 'email', 'traite', 'createdAt'],
  },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: adminOnly },
  defaultSort: '-createdAt',
  hooks: { afterChange: [notifierContact] },
  fields: [
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'telephone', label: 'Téléphone', type: 'text' },
      ],
    },
    { name: 'organisation', label: 'Organisation', type: 'text' },
    { name: 'sujet', label: 'Sujet', type: 'text', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    {
      name: 'consentement',
      label: 'Consentement',
      type: 'checkbox',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'traite',
      label: 'Traité',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
