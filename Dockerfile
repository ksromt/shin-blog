FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone server
COPY --from=builder /app/.next/standalone ./
# Copy static assets (not included in standalone)
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Copy i18n translation files (loaded at runtime by next-intl)
COPY --from=builder /app/messages ./messages
# Copy Prisma schema + engine (needed for runtime queries)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib/generated ./lib/generated

EXPOSE 3000

CMD ["node", "server.js"]
