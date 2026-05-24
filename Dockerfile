FROM node:22-slim AS base
WORKDIR /app
COPY package*.json ./

FROM base AS deps
RUN npm ci --omit=dev

FROM base AS build
# Copy prisma config and source (schema lives at src/database/prisma/schema.prisma)
COPY tsconfig.json prisma.config.mjs ./
COPY src ./src
# Dummy URL so prisma.config.js env("DATABASE_URL") doesn't throw during generate
ARG DATABASE_URL=postgresql://localhost/build
ENV DATABASE_URL=$DATABASE_URL
RUN npm ci
RUN npx prisma generate
RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY package.json ./

EXPOSE 3000

CMD ["dist/server.js"]
