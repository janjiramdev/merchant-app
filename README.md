# merchant-app

## Description
This project create for test backend system with TypeScript + NestJS + MongoDB

## Prerequisite
- Node v20.x.x or later
- MongoDB v8.0
- Docker (Optional)
- Use repository directory as terminal to run command and project

## Project setup
- Create own MongoDB database or setup via docker
```bash
# Pull MongoDB image
$ docker pull mongo:8.0

# Run MongoDB container
$ docker run -d -p <DATABASE_CONTAINER_EXPOSE_PORT>:27017 --name=<DATABASE_CONTAINER_NAME> mongo:8.0
```
- Config env follow up .env.example
- Install NodeJS dependencies
```bash
$ npm install
```

## Run project

```bash
# Development
$ npm run start

# Watch mode
$ npm run start:dev
```

## Setup and run project via docker
```bash
$ docker-compose up -d
```

## Author
Janjira Mosamai

## Test