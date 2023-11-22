FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

EXPOSE 5000

CMD [ "npm", "run", "dev" ]