FROM node:18-alpine as builder
WORKDIR "/app"
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:18-alpine as production
WORKDIR "/app"
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3030
CMD [ "sh", "-c", "node dist/main"]
