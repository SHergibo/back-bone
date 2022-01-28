# REST API Boilerplate

This is a simple REST API boilerplate developed using Node.js, Express and MongoDB

## Features

- CORS enabled
- Express + MongoDB ([Mongoose](http://mongoosejs.com/))
- Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
- Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
- Gzip compression with [compression](https://github.com/expressjs/compression)
- Sanitize inputs against query selector injection attacks with [mongo-sanitize](https://github.com/vkarpov15/mongo-sanitize)
- Uses [isomorphic-dompurify](https://www.npmjs.com/package/isomorphic-dompurify) to clean all incoming data before storing them in the database
- Tests with [Jest](https://jestjs.io/)
- Logging with [morgan](https://github.com/expressjs/morgan)
- Authentication and Authorization with [passport](http://passportjs.org)

## Requirements

- [Node v16.13+](https://nodejs.org/en/download/current/)
- [MongoDB v4.2](https://docs.mongodb.com/v4.2/installation/)

## Getting Started

#### 1) Clone the repo

```bash
git clone https://github.com/SHergibo/back-bone.git
cd back-bone
rm -rf .git
```

#### 2) Add your environments data

Rename `development-sample.env`, `production-sample.env` and `test-sample.env` to `development.env`, `production.env` and `test.env`.

In these files, you need to add your `JWT_SECRET`, you can alse change your DB name in `MONGO_URI`, for example `mongodb://localhost:27017/my-rest-api`.

In `production.env`, you can add one or multiple urls in `CORS_ORIGIN` for security reasons. Only those urls will have access to the REST API.

For example:
for one url: `CORS_ORIGIN = "www.example.com"`
for multiple urls: `CORS_ORIGIN = ["www.example.com", "www.example2.com"]`

#### 3) Install dependencies

```bash
npm install
```

#### 4) Running the app

Locally

```bash
npm run dev
```

In production

```bash
npm run start
```

Running the test

```bash
npm run test
```

## Endpoints

### Users

| Method | URI                  | Securized | Result                                |
| ------ | -------------------- | --------- | ------------------------------------- |
| POST   | api/v1/users         | -         | Create new user                       |
| GET    | api/v1/users/:userId | Logged    | Get user informations                 |
| PATCH  | api/v1/users/:userId | Logged    | Update some fields of a user document |
| DELETE | api/v1/users/:userId | Logged    | Delete a user                         |

### Auth

| Method | URI                       | Securized | Result                    |
| ------ | ------------------------- | --------- | ------------------------- |
| POST   | api/v1/auth/login         | -         | Create user access token  |
| PATCH  | api/v1/auth/refresh-token | -         | Refresh user access token |
| DELETE | api/v1/auth/logout        | -         | Delete user access token  |

## License

[MIT License](README.md) - [Sacha Hergibo](https://github.com/SHergibo)
