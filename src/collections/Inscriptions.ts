import type { CollectionConfig } from 'payload'
import { adminOnly, authenticated } from '../access'
import { notifierInscription } from '../hooks/notifications'

/**
 * Inscriptions en ligne (F5). Créées uniquement par le formulaire public
 * (action serveur, avec anti-spam), consultables et exportables en CSV dans le back-office.
 *
 * Le groupe « paiement » prépare la phase 2 (mobile money : Orange Money, Moov Money, Wave),
 * hors du marché actuel : il reste masqué tant que PAIEMENT_ACTIF n'est pas activé.
 */
export const Inscriptions: CollectionConfig = {
  slug: 'inscriptions',
  labels: { singular: 'Inscription', plural: 'Inscriptions' },
  admin: {
    useAsTitle: 'reference',
    group: 'Inscriptions et contacts',
    defaultColumns: [
      'reference',
      'nom',
      'prenom',
      'formation',
      'sessionLibelle',
      'statut',
      'createdAt',
    ],
  },
  access: {
    // Aucune création via l'API publique : seul le formulaire du site (action serveur) crée des inscriptions.
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  defaultSort: '-createdAt',
  hooks: { afterChange: [notifierInscription] },
  fields: [
    {
      name: 'reference',
      label: 'Référence',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              const d = new Date()
              const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
              return `INS-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'statut',
      label: 'Statut',
      type: 'select',
      defaultValue: 'nouvelle',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Nouvelle', value: 'nouvelle' },
        { label: 'En cours de traitement', value: 'en-cours' },
        { label: 'Confirmée', value: 'confirmee' },
        { label: 'Annulée', value: 'annulee' },
      ],
    },
    {
      name: 'langue',
      label: 'Langue du formulaire',
      type: 'select',
      defaultValue: 'fr',
      options: ['fr', 'en'],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'formation',
          label: 'Formation',
          type: 'relationship',
          relationTo: 'formations',
          required: true,
        },
        {
          name: 'sessionId',
          label: 'Identifiant de session',
          type: 'text',
          admin: { readOnly: true },
        },
        { name: 'sessionLibelle', label: 'Session', type: 'text', admin: { readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'civilite', label: 'Civilité', type: 'select', options: ['M.', 'Mme'] },
        { name: 'nom', label: 'Nom', type: 'text', required: true },
        { name: 'prenom', label: 'Prénom', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'E-mail', type: 'email', required: true },
        { name: 'telephone', label: 'Téléphone', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'organisation', label: 'Organisation / entreprise', type: 'text' },
        { name: 'fonction', label: 'Fonction', type: 'text' },
      ],
    },
    { name: 'message', label: 'Message', type: 'textarea' },
    {
      name: 'consentement',
      label: 'Consentement au traitement des données (loi n°2013-015)',
      type: 'checkbox',
      required: true,
      admin: { readOnly: true },
    },
    { name: 'notesInternes', label: 'Notes internes IAMA', type: 'textarea' },
    {
      name: 'paiement',
      label: 'Paiement (phase 2)',
      type: 'group',
      admin: {
        condition: () => process.env.PAIEMENT_ACTIF === 'true',
        description: 'Réservé au paiement mobile money de la phase 2.',
      },
      fields: [
        {
          name: 'statut',
          label: 'Statut du paiement',
          type: 'select',
          defaultValue: 'non-requis',
          options: [
            { label: 'Non requis', value: 'non-requis' },
            { label: 'En attente', value: 'en-attente' },
            { label: 'Payé', value: 'paye' },
            { label: 'Échoué', value: 'echoue' },
            { label: 'Remboursé', value: 'rembourse' },
          ],
        },
        { name: 'montant', label: 'Montant (FCFA)', type: 'number' },
        {
          name: 'operateur',
          label: 'Opérateur',
          type: 'select',
          options: [
            { label: 'Orange Money', value: 'orange-money' },
            { label: 'Moov Money', value: 'moov-money' },
            { label: 'Wave', value: 'wave' },
            { label: 'Autre', value: 'autre' },
          ],
        },
        { name: 'referenceTransaction', label: 'Référence de transaction', type: 'text' },
        { name: 'datePaiement', label: 'Date de paiement', type: 'date' },
      ],
    },
  ],
}
