FROM node:14
WORKDIR /game
COPY package.json .
RUN npm install
COPY . .
CMD npm start