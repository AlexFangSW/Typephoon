FROM node:20-alpine

WORKDIR /app

COPY ./package.json \
  ./package-lock.json \
  ./next.config.ts \
  ./postcss.config.mjs \
  ./tailwind.config.ts \
  ./tsconfig.json \
  /app/

COPY ./public/ /app/public
COPY ./src/ /app/src

RUN npm i

RUN npm run build

CMD [ "npm", "run", "start" ]
