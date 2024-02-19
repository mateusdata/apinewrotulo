# pull official base image
FROM node:20.10.0-alpine as api

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add app
COPY . ./


FROM mysql:latest as db

# Set up environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
ENV MYSQL_DATABASE=${meurotulo}
ENV MYSQL_USER=${DB_USER}
ENV MYSQL_PASSWORD=${DB_PASSWORD}

# Optionally, copy any SQL initialization scripts
COPY init-scripts /docker-entrypoint-initdb.d/

# pull official base image
FROM node:20.10.0-alpine

# set working directory
WORKDIR /app

COPY --from=api /app/dist ./api
COPY --from=api /app/node_modules ./api/node_modules

# Expose API and MySQL ports
EXPOSE ${BACKEND_PORT}
EXPOSE ${DB_PORT}
# start app
CMD ["npm", "run", "start"]


