FROM node:22-bookworm-slim AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

EXPOSE 3002

CMD ["node", "dist/main.js"]