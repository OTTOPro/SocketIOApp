FROM node:latest
ARG TZ=America/Toronto
ENV TZ=$TZ

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "app.js" ]