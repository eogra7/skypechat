FROM node:10
WORKDIR /usr/src/app
RUN npm install -g serve
ADD backend/build ./backend/build
ADD serve.json ./
EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]