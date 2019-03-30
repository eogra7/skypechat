FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
ENV ENVIRONMENT prod
CMD [ "npm", "start" ]

