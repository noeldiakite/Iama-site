import type { GlobalConfig } from 'payload'
import { authenticated } from '../access'
import { revalidateEverything } from '../hooks/revalidate'

/** Coordonnées, chiffres clés et réglages communs à tout le site. */
export const Parametres: GlobalConfig = {
  slug: 'parametres',
  label: 'Paramètres du site',
  admin: { group: 'Administration' },
  access: { read: () => true, update: authenticated },
  hooks: { afterChange: [revalidateEverything] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Coordonnées',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: false,
              fields: [
                { name: 'adresse', label: 'Adresse', type: 'textarea', localized: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'telephone', label: 'Téléphone', type: 'text' },
                    { name: 'mobile', label: 'Mobile / WhatsApp', type: 'text' },
                  ],
                },
                { name: 'email', label: 'E-mail public', type: 'email' },
                { name: 'horaires', label: 'Horaires', type: 'text', localized: true },
                {
                  name: 'carteUrl',
                  label: 'Lien de carte (Google Maps / OpenStreetMap)',
                  type: 'text',
                },
              ],
            },
            {
              name: 'reseaux',
              label: 'Réseaux sociaux',
              type: 'array',
              fields: [
                {
                  name: 'reseau',
                  type: 'select',
                  options: ['facebook', 'linkedin', 'youtube', 'x', 'instagram', 'whatsapp'],
                },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Accueil',
          fields: [
            {
              name: 'accroche',
              label: 'Accroche (titre principal)',
              type: 'text',
              localized: true,
            },
            { name: 'sousTitre', label: 'Sous-titre', type: 'textarea', localized: true },
            {
              name: 'chiffresCles',
              label: 'Chiffres clés',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'valeur', label: 'Valeur', type: 'text', required: true },
                {
                  name: 'libelle',
                  label: 'Libellé',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Notifications',
          fields: [
            {
              name: 'emailNotifications',
              label: 'E-mail qui reçoit les inscriptions et messages',
              type: 'email',
            },
          ],
        },
      ],
    },
  ],
}
