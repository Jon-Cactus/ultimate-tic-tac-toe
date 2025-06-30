# -------- 1. Build stage --------
FROM node:20-alpine AS builder

WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY shared/ ./shared/
COPY server/ ./server/
RUN npm run --prefix server build

# -------- 2. Production stage --------
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --production
COPY --from=builder /app/server/dist ./dist

EXPOSE 3001

# Restore the final, correct CMD
CMD ["npm", "start"]