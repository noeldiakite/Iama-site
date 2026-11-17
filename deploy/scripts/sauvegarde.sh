#!/usr/bin/env bash
# Sauvegarde quotidienne de la base et des médias, conservée 30 jours (F9).
# Crontab de l'utilisateur de déploiement :  15 2 * * * /opt/iama-site/deploy/scripts/sauvegarde.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
DEST=${BACKUP_DIR:-/var/backups/iama}
DATE=$(date +%F)
mkdir -p "$DEST"
docker compose exec -T db pg_dump -U iama -Fc iama > "$DEST/iama-db-$DATE.dump"
docker run --rm -v "$(basename "$PWD")_media:/media:ro" -v "$DEST:/backup" alpine tar czf "/backup/iama-media-$DATE.tar.gz" -C /media .
find "$DEST" -type f -mtime +30 -delete
echo "Sauvegarde $DATE terminée dans $DEST"
# Restauration : docker compose exec -T db pg_restore -U iama -d iama --clean < iama-db-AAAA-MM-JJ.dump
