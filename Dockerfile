# Étape 1 – Build
FROM node:latest AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 – Production
FROM node:latest
WORKDIR /app

COPY --from=builder /app ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", ".svelte-kit/output/server/index.js"]
