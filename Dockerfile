FROM node:8
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD node bin/www
EXPOSE 3000