# Site web de l’IAMA — iama.aero

Refonte du site de l’Institut Africain des Métiers de l’Aérien (marché TDR-IAMA-WEB-2026-001, E&SER MALI).

**Pile technique** : Next.js 16 (TypeScript, App Router) · Payload CMS 3 (back-office intégré, en français) · PostgreSQL · Tailwind CSS 4 · next-intl (FR/EN).

## Démarrer en local

Prérequis : Node.js 22, pnpm 10, Docker (ou un PostgreSQL 16 local).

```bash
cp .env.example .env          # puis renseigner PAYLOAD_SECRET, SEED_ADMIN_* …
docker compose up -d db       # base PostgreSQL
pnpm install
pnpm seed                     # reprise des contenus du site actuel + compte admin
pnpm dev                      # http://localhost:3000/fr  ·  back-office : /admin
```

## Scripts

| Commande | Rôle |
| --- | --- |
| `pnpm dev` | Serveur de développement (le schéma de la base suit le code) |
| `pnpm build` / `pnpm start` | Build et serveur de production (la base doit être joignable au build) |
| `pnpm seed` (`--force`) | Importe les contenus repris du site actuel (`--force` vide puis réimporte) |
| `pnpm payload migrate:create <nom>` | Crée une migration après une modification des collections |
| `pnpm payload migrate` | Applique les migrations (fait aussi automatiquement au démarrage en production) |
| `pnpm generate:types` | Régénère `src/payload-types.ts` |
| `pnpm lint` · `pnpm typecheck` | Contrôles qualité (aussi exécutés par la CI GitHub) |

## Organisation du code

```
src/
  app/(frontend)/[locale]/   pages publiques, préfixées /fr ou /en
  app/(frontend)/actions.ts  formulaires (inscription, contact) : validation, anti-spam
  app/(payload)/             back-office et API Payload (/admin, /api)
  collections/  globals/     modèle de contenu (voir docs/ARBORESCENCE.md)
  components/                composants du design system (ui/) et blocs de page
  i18n/  messages/           routage FR/EN et textes d’interface
  seed/                      reprise des contenus du site actuel
  migrations/                migrations de la base
deploy/                      Nginx, sauvegardes
docs/                        arborescence, déploiement
```

- Arborescence, modèle de contenu et correspondance avec le cadrage : [docs/ARBORESCENCE.md](docs/ARBORESCENCE.md)
- Préproduction et production : [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)
- Charte graphique vivante (design system) : `/fr/charte` (non indexée)
