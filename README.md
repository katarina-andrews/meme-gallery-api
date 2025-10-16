# Meme Gallery API

A CRUD API built with Node.js, Express, Javascript, TypeScript, Prisma, and PostgreSQL (AWS RDS).
This API allows users to register, log in, and manage memes — including creating, updating, liking/unliking, and deleting them.

[Deployment URL](https://meme-gallery-api-4pmz.onrender.com/)

## Project Overview

- Core Features:
- User registration and login (JWT authentication)
- Create, read, update, and delete memes
- Like/unlike memes
- PostgreSQL integration via Prisma ORM
- Deployed using Render

## Local Setup 

env vars  

```
DATABASE_URL=your_postgres_rds_connection_url
PORT=3000
JWT_SECRET=your_jwt_secret
```

scripts in ```package.json```

```
"scripts": {
  "start": "node dist/index.js",
  "dev": "nodemon --loader ts-node/esm src/index.js",
  "build": "tsc -p tsconfig.json"
}
```

## API Docs

**Auth Routes**

POST ```/auth/register```
- Register a new user.

![user registration success screenshot](screenshots/validation-success-user.png)

Error

![user registration error screenshot](screenshots/validation-error-short-password.png)


POST ```/auth/login```
- Authenticate user and return a JWT token.

![login user screenshot](screenshots/login-user2.png)


**Meme Routes**

GET ```/memes```
- Retrieve all memes.

GET ```/memes/:id```
- Retrieve a specific meme by ID.

GET ```/memes/users/:id/memes```
- Retrieve all memes created by a specific user.

POST ```/memes```
- Create a new meme (requires JWT).

![create meme protected screenshot](screenshots/create-meme-protected.png)

Error 

![create meme error meme](screenshots/create-meme-error.png)

PUT ```/memes/:id```
- Update a meme (requires JWT).

![update meme protected screenshot](screenshots/update-meme-protected.png)

Error

![update error protected screenshot](screenshots/update-error-protected.png)

DELETE ```/memes/:id```
- Delete a meme (requires JWT).

![delete meme protected screenshot](screenshots/delete-meme-protected.png)

Error

![delete error protected screenshot](screenshots/delete-error-protected.png)

POST ```/memes/:id/like```
- Like or unlike a meme (requires JWT).

![user like meme screenshot](screenshots/user-like-meme.png)

![user unlike meme screenshot](screenshots/user-unlike-meme.png)

