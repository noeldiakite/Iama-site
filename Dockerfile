# Image de production du site IAMA (Next.js + Payload CMS, sortie « standalone »).
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# La base doit être joignable pendant la construction (pages générées à l'avance) :
# passer DATABASE_URL et PAYLOAD_SECRET en arguments de build (voir docker-compose.yml).
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG SITE_ENV
ENV DATABASE_URL=$DATABASE_URL PAYLOAD_SECRET=$PAYLOAD_SECRET NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL SITE_ENV=$SITE_ENV
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Fichiers téléversés depuis le back-office (volume persistant)
RUN mkdir -p /app/media /app/.next/cache && chown -R nextjs:nodejs /app/media /app/.next
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
