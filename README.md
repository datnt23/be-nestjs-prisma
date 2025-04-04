# E-commerce API

## Description

This project is an E-commerce API built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/). It provides a scalable and efficient backend solution for managing products, users, orders, and payments.

## Project setup

```bash
$ npm install
```

## Setup Database (PostgreSQL)

Follow these steps to set up your database:

1. Open your PostgreSQL query tool.
2. Execute the `CreateTable_vn_units.sql` file located in the [postgresql directory](postgresql) to create the necessary tables.
3. Execute the `ImportData_vn_units.sql` file to import the required data.

Alternatively, you can use Prisma migrations:

```bash
$ npx prisma migrate dev --name initial
$ npx prisma db seed
```

If using Prisma migration, only steps 1 and 3 from the manual setup are needed.

## Compile and run the project

```bash
# development mode
$ npm run start

# watch mode (auto-restart on changes)
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

For production deployment, follow the official NestJS [deployment guide](https://docs.nestjs.com/deployment).

```bash
$ npm install -g mau
$ mau deploy
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Community Discord](https://discord.gg/G7Qnnhy)

## License

This project is [MIT licensed](LICENSE).

# Table of Contents
- [English](#english)
- [Vietnamese](#vietnamese)
