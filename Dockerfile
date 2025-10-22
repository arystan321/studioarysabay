# Stage 1: deps + build
FROM node:20-alpine AS builder
WORKDIR /app

# install deps faster
COPY package.json package-lock.json ./
RUN npm ci --silent

# copy source & build
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Only copy needed files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port and run
EXPOSE 3000
CMD ["npm", "run", "start"]
