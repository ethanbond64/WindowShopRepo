FROM node:14.5.0

ENV UI_PATH /extension

WORKDIR $UI_PATH

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "watch"]