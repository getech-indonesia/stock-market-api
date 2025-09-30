FROM node:18-alpine AS base
WORKDIR /var/www/html

COPY . .


RUN apk update && apk upgrade

RUN npm i -g pnpm
RUN pnpm install
RUN npm run build

FROM base AS dev
WORKDIR /var/www/html
COPY --from=base /var/www/html .

CMD pnpm run dev

FROM base AS prod
WORKDIR /var/www/html
COPY --from=base /var/www/html/package.json .
COPY --from=base /var/www/html/pnpm-lock.yaml .
COPY --from=base /var/www/html/next.config.js ./
COPY --from=base /var/www/html/public ./public
COPY --from=base /var/www/html/.next ./.next
ENTRYPOINT ["pnpm", "start"]