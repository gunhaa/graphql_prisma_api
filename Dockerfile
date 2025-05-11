FROM node:lts

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4001

CMD ["node", "./dist/src/index.js"]