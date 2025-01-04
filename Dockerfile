FROM node:22.11-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:22.11-alpine AS production

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn global add ts-node && yarn install --prod
COPY --from=builder /app/dist ./dist
CMD ["yarn", "prod"]
