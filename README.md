# Cloud Access SaaS Platform

A Node.js and Express API scaffold with email/password registration and login, bcrypt password hashing, JWT issuance, and Prisma access to a PostgreSQL user model.

## Architecture

![Current API architecture](docs/images/system-architecture.svg)

[Open system architecture diagram](docs/images/system-architecture.svg)

## Authentication workflow

![Authentication request workflow](docs/images/auth-workflow.svg)

[Open authentication workflow diagram](docs/images/auth-workflow.svg)

## Current implementation

- Express server with CORS and JSON request parsing.
- `POST /api/auth/register` creates a user with a bcrypt-hashed password.
- `POST /api/auth/login` verifies the password and returns a JWT with a seven-day expiry.
- Prisma `User` model backed by PostgreSQL.
- Runtime configuration reads environment variables via dotenv.

## Important scope note

The checked-in code currently demonstrates authentication basics. Cloud-provider IAM provisioning, tenant isolation, access-policy management, billing flows, production deployment, and authorization middleware should not be considered implemented unless added and tested separately. Configure `JWT_SECRET` and database connectivity securely before running outside local development.

## Run locally

1. Install a supported Node.js version.
2. Run `npm install`.
3. Configure environment variables for PostgreSQL and `JWT_SECRET` according to the Prisma version in use.
4. Generate the Prisma client and apply the required database migrations.
5. Start the server with `node server.js`.

> The repository currently defines a placeholder test script that exits with an error; automated tests are not yet configured.
