# Arborescence et modèle de contenu

Toutes les pages existent en français et en anglais : `/fr/...` et `/en/...` (balises hreflang, sélecteur de langue sur chaque page). La racine `/` redirige vers la langue du navigateur.

## Pages publiques

| Adresse | Page | Source des contenus | Réf. cadrage |
| --- | --- | --- | --- |
| `/fr` | Accueil : accroche, chiffres clés, formations à la une, atouts, métiers, actualités, partenaires | Paramètres du site + collections | F2 |
| `/fr/formations` | **Catalogue** : recherche par mot-clé, filtres domaine / modalité / durée / prochaine session | Formations, Domaines | F3 |
| `/fr/formations/[slug]` | **Fiche formation** : objectifs, public, prérequis, programme, évaluation, tarif, sessions, brochure, bouton « S’inscrire » | Formations | F4 |
| `/fr/inscription` | **Inscription** pré-remplie (`?formation=…&session=…`) | → Inscriptions | F5 |
| `/fr/contact` | **Contact** : formulaire, coordonnées, carte | Paramètres → Messages de contact | F2 |
| `/fr/institut` | Présentation de l’IAMA | Page « institut » | F2 |
| `/fr/accreditations` | Agréments ANAC et IATA, PDF téléchargeables | Accréditations | F2 |
| `/fr/metiers` | Métiers de l’aérien et formations associées | Métiers | — |
| `/fr/formateurs` | Formateurs | Formateurs | F2 |
| `/fr/actualites`, `/fr/actualites/[slug]` | Actualités, partage réseaux sociaux | Actualités | F2 |
| `/fr/confidentialite`, `/fr/mentions-legales` | Pages libres | Pages | F7 |
| `/fr/charte` | Charte graphique (design system), non indexée | — | F13 |
| `/sitemap.xml`, `/robots.txt` | Plan du site bilingue | automatique | F10 |
| `/admin` | Back-office Payload, en français | — | F6 |

## Collections du back-office

| Groupe | Collection | Points clés |
| --- | --- | --- |
| Formations | **Formations** | Champs bilingues, sessions (dates, lieu, places, statut), domaine, type, modalités, durée, prix FCFA (vide = « Sur devis »), formateurs, métiers, mise en avant, brouillons et historique des versions |
| | Domaines | Filtre principal du catalogue |
| | Métiers | Repris du site actuel (6 métiers) |
| | Formateurs | Photo, fonction, biographie, expertises |
| Inscriptions et contacts | **Inscriptions** | Référence `INS-AAAAMMJJ-XXXX`, statut de traitement, accusé de réception + notification par e-mail, export CSV. Groupe « Paiement » prêt pour la phase 2 (masqué) |
| | Messages de contact | Notification par e-mail, export CSV |
| Contenus | Actualités, Pages, Accréditations, Partenaires, Médias | Médias : texte alternatif bilingue obligatoire, formats WebP générés automatiquement |
| Administration | Utilisateurs | Rôles Administrateur / Éditeur, blocage après 5 tentatives de connexion |
| | Paramètres du site | Coordonnées, réseaux sociaux, accroche et chiffres clés de l’accueil, e-mail de notification |

## Préparation de la phase 2 (paiement mobile money, hors marché)

- Chaque inscription porte déjà un groupe `paiement` (statut, montant, opérateur Orange Money / Moov Money / Wave, référence de transaction, date), masqué tant que `PAIEMENT_ACTIF=false`.
- Le parcours « fiche → inscription » est en place : la phase 2 ajoutera une étape de paiement après la création de l’inscription, sans refonte.

## Contenus à fournir ou valider par l’IAMA

- Logo en haute définition (le logo actuel ne fait que 124×48 px) et éventuelle charte existante.
- Fiches complètes des 8 formations : 4 fiches sont encore incomplètes (« Programme détaillé à fournir par l’IAMA »).
- Calendrier réel des sessions : **les sessions affichées sont des exemples**.
- Traduction anglaise officielle : les textes anglais actuels sont des traductions provisoires de maquette.
- Chiffres clés de l’accueil et horaires d’ouverture (le site actuel indique « du dimanche au jeudi »).
- Date de création : le site actuel indique 2005 (page « À propos ») et 2004 (version anglaise).
- Politique de confidentialité et mentions légales (textes provisoires).
