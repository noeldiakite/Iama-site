# Préproduction et production

Les deux environnements tournent sur le VPS de l’IAMA (Ubuntu, 4 vCPU, 8 Go, 160 Go recommandés), avec Docker et Nginx. La préproduction (`test.iama.aero`) sert au suivi de l’avancement et à la recette ; elle n’est pas indexée par les moteurs de recherche (`SITE_ENV=preprod`).

| | Préproduction | Production |
| --- | --- | --- |
| Adresse | https://test.iama.aero | https://www.iama.aero |
| Dossier | `/opt/iama-preprod` | `/opt/iama-site` |
| Port local | 3001 | 3000 |
| `SITE_ENV` | `preprod` | `prod` |
| Branche | dernière PR validée | `main` |

> En attendant le VPS de l’IAMA (souscription prévue avant le 4 décembre), la préproduction peut être hébergée provisoirement sur un petit VPS d’E&SER MALI avec la même procédure.

## 1. Préparer le serveur (une fois)

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx ufw
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable
sudo usermod -aG docker $USER   # puis se reconnecter
```

DNS : enregistrement A `test.iama.aero` (et plus tard `www.iama.aero`, `iama.aero`) vers l’IP du VPS.

## 2. Installer le site

```bash
sudo git clone https://github.com/noeldiakite/iama-site.git /opt/iama-preprod && cd /opt/iama-preprod
cp .env.example .env && nano .env
#   POSTGRES_PASSWORD, PAYLOAD_SECRET (openssl rand -hex 32),
#   NEXT_PUBLIC_SERVER_URL=https://test.iama.aero, SITE_ENV=preprod, SMTP_*
docker compose up -d db
docker compose build web && docker compose up -d web
```

Les migrations de la base s’appliquent automatiquement au démarrage. Pour importer les contenus repris du site actuel (une seule fois, depuis un poste avec le code et Node.js, ou sur le serveur) :

```bash
PAYLOAD_DB_PUSH=false DATABASE_URL=postgres://iama:MOT_DE_PASSE@127.0.0.1:5432/iama pnpm seed
```

Pour la préproduction sur le même VPS que la production, changer le port publié (`127.0.0.1:3001:3000`) et le nom du projet : `docker compose -p iama-preprod …`.

## 3. Nginx et HTTPS

```bash
sudo cp deploy/nginx/iama.conf /etc/nginx/sites-available/iama
# préprod : remplacer les server_name par test.iama.aero et le port 3000 par 3001
sudo ln -s /etc/nginx/sites-available/iama /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d test.iama.aero
```

## 4. Sauvegardes quotidiennes (30 jours)

```bash
crontab -e
15 2 * * * /opt/iama-site/deploy/scripts/sauvegarde.sh >> /var/log/iama-sauvegarde.log 2>&1
```

Tester une restauration avant la mise en ligne (critère de recette) : voir la dernière ligne du script.

## 5. Mettre à jour

```bash
cd /opt/iama-preprod && git pull && docker compose build web && docker compose up -d web
```

Après une modification des collections : créer la migration en local (`pnpm payload migrate:create <nom>`), la committer ; elle s’appliquera au redémarrage.

## Points ouverts

- Service d’envoi d’e-mails : SMTP de l’hébergeur, Brevo ou Resend (compte au nom de l’IAMA).
- Matomo auto-hébergé : à installer sur le même VPS à l’étape E2.
