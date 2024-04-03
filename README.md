<p align="center">
  <img src="https://github.com/keepgreen.png" width="200" alt="Keep Green" />
</p>

## Description

KeepGreen Backend using <a href="http://nestjs.com/" target="blank">NestJs</a> + MariaDB.

## Installation

```bash
$ npm install
```

## Running the app

### Prerequisites
```bash
# go to mariadb docker
cd docker/mariadb

# run mariadb docker
docker compose up -d

# back to project main folder
cd ../../

# copy .env.example to .env
cp .env.example .env

# don't forget to update .env with your own variables.
```

```bash
# run migrate schema to mariadb
$ npm run db:push

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Stay in touch

- Twitter - [@KeepGreenSOL](https://twitter.com/KeepGreenSOL)