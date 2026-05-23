FROM docker.arvancloud.ir/node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --registry="https://package-mirror.liara.ir/repository/npm/"
# Remove this line: RUN chmod +x node_modules/.bin/*
COPY . .
RUN npm run build

FROM docker.arvancloud.ir/node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
