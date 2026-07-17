# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund

FROM dependencies AS builder
COPY . .
RUN npm run build
RUN npm prune --omit=dev --ignore-scripts

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app
RUN groupadd --system --gid 1001 commonplace \
    && useradd --system --uid 1001 --gid commonplace commonplace

COPY --from=builder --chown=commonplace:commonplace /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=commonplace:commonplace /app/node_modules ./node_modules
COPY --from=builder --chown=commonplace:commonplace /app/dist ./dist

USER commonplace
EXPOSE 3000
CMD ["npm", "run", "start"]
