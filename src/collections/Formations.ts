import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoFields } from '../fields/seo'
import { revalidateCollection, revalidateCollectionDelete } from '../hooks/revalidate'

/**
 * Catalogue des formations (F3) et fiche formation (F4).
 * Les sessions sont saisies directement dans la formation ; une inscription
 * référence la formation et l'identifiant de la session choisie.
 */
export const Formations: CollectionConfig = {
  slug: 'formations',
  labels: { singular: 'Formation', plural: 'Formations' },
  admin: {
    useAsTitle: 'titre',
    group: 'Formations',
    defaultColumns: ['titre', 'domaine', 'type', 'prix', 'enVedette', '_status'],
    listSearchableFields: ['titre', 'resume'],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    afterChange: [revalidateCollection('formations')],
    afterDelete: [revalidateCollectionDelete('formations')],
  },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true },
    {
      name: 'resume',
      label: 'Résumé (carte du catalogue)',
      type: 'textarea',
      localized: true,
      maxLength: 280,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Présentation',
          fields: [
            { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
            { name: 'description', label: 'Description', type: 'richText', localized: true },
            {
              name: 'objectifs',
              label: 'Objectifs',
              type: 'array',
              localized: true,
              labels: { singular: 'Objectif', plural: 'Objectifs' },
              fields: [{ name: 'texte', label: 'Objectif', type: 'text', required: true }],
            },
            { name: 'public', label: 'Public concerné', type: 'textarea', localized: true },
            { name: 'prerequis', label: 'Prérequis', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Programme et évaluation',
          fields: [
            { name: 'programme', label: 'Programme', type: 'richText', localized: true },
            { name: 'methodes', label: 'Méthodes pédagogiques', type: 'textarea', localized: true },
            { name: 'evaluation', label: 'Évaluation', type: 'textarea', localized: true },
            { name: 'validite', label: 'Validité / certification', type: 'text', localized: true },
            {
              name: 'brochure',
              label: 'Brochure PDF',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { equals: 'application/pdf' } },
            },
          ],
        },
        {
          label: 'Sessions',
          fields: [
            {
              name: 'sessions',
              label: 'Sessions programmées',
              type: 'array',
              labels: { singular: 'Session', plural: 'Sessions' },
              admin: {
                description:
                  'Dates et places disponibles. Le bouton « S’inscrire » propose les sessions ouvertes.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'dateDebut',
                      label: 'Début',
                      type: 'date',
                      required: true,
                      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
                    },
                    {
                      name: 'dateFin',
                      label: 'Fin',
                      type: 'date',
                      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'lieu', label: 'Lieu', type: 'text', defaultValue: 'IAMA, Bamako' },
                    { name: 'placesTotal', label: 'Places', type: 'number', min: 0 },
                    { name: 'placesRestantes', label: 'Places restantes', type: 'number', min: 0 },
                  ],
                },
                {
                  name: 'statut',
                  label: 'Statut',
                  type: 'select',
                  defaultValue: 'ouverte',
                  options: [
                    { label: 'Inscriptions ouvertes', value: 'ouverte' },
                    { label: 'Complète', value: 'complete' },
                    { label: 'Annulée', value: 'annulee' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // --- Barre latérale : critères de filtre du catalogue ---
    slugField(),
    {
      name: 'domaine',
      label: 'Domaine',
      type: 'relationship',
      relationTo: 'domaines',
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      defaultValue: 'initiale',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Formation initiale', value: 'initiale' },
        { label: 'Maintien de compétences', value: 'continue' },
        { label: 'Sur mesure (entreprise)', value: 'sur-mesure' },
      ],
    },
    {
      name: 'modalites',
      label: 'Modalités',
      type: 'select',
      hasMany: true,
      defaultValue: ['presentiel'],
      admin: { position: 'sidebar' },
      options: [
        { label: 'Présentiel', value: 'presentiel' },
        { label: 'À distance', value: 'distanciel' },
        { label: 'Mixte', value: 'mixte' },
      ],
    },
    {
      type: 'row',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'dureeJours', label: 'Durée (jours)', type: 'number', min: 0 },
        { name: 'dureeHeures', label: 'Durée (heures)', type: 'number', min: 0 },
      ],
    },
    {
      name: 'prix',
      label: 'Prix (FCFA HT)',
      type: 'number',
      min: 0,
      admin: { position: 'sidebar', description: 'Laisser vide pour afficher « Sur devis ».' },
    },
    {
      name: 'formateurs',
      label: 'Formateurs',
      type: 'relationship',
      relationTo: 'formateurs',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'metiers',
      label: 'Métiers visés',
      type: 'relationship',
      relationTo: 'metiers',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'enVedette',
      label: 'Mettre en avant sur l’accueil',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'ordre',
      label: 'Ordre dans le catalogue',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    seoFields,
  ],
}
