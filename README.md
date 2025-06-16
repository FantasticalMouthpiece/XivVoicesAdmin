# XIV Voices Admin

An Admin Panel and API service for the XIV Voices plugin.

## Features

- Next.js with TypeScript
- Discord OAuth authentication
- Prisma ORM with PostgreSQL database
- Fully dockerized for both development and production environments

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- Discord Developer Account
- Docker and Docker Compose

### Setup

1. Clone the repository:

```bash
git clone https://github.com/FantasticalMouthpiece/XivVoicesAdmin.git
cd XivVoicesAdmin
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a Discord OAuth application:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "OAuth2" tab
   - Add a redirect URL: `http://localhost:3000/api/auth/callback/discord`
   - Copy the Client ID and Client Secret

4. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Discord Client ID and Client Secret
   - Generate a random string for NEXTAUTH_SECRET (you can use `openssl rand -base64 32`)

```bash
cp .env.example .env
```

5. Start the PostgreSQL database using Docker:

```bash
docker-compose up -d postgres
```

6. Run the development server:

```bash
npm run dev
# or
yarn dev
```

7. Push the Prisma schema to the database:

```bash
npx prisma db push
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Management

This project uses Prisma ORM with a PostgreSQL database running in Docker.

### Docker Commands

- Start the database only: `docker-compose up -d postgres`
- Start the entire application (including database): `docker-compose up -d`
- Stop all containers: `docker-compose down`
- View database logs: `docker-compose logs -f postgres`
- View application logs: `docker-compose logs -f app`
- View all logs: `docker-compose logs -f`

### Prisma Commands

- Generate Prisma Client: `npx prisma generate`
- Push schema changes to database: `npx prisma db push`
- Open Prisma Studio (database GUI): `npx prisma studio`
- Create and apply migrations: `npx prisma migrate dev --name <migration-name>`

## Deployment

### Docker Deployment

For production environments, a separate configuration file is provided:

1. Create a `.env.production` file with your production environment variables:
```bash
cp .env.production.example .env.production
# Edit the .env.production file with your production values
```

2. Build and start the containers using the production configuration:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. The application will be available at your configured domain.

4. To stop the application:
```bash
docker-compose -f docker-compose.prod.yml down
```

The production configuration includes:
- More secure database settings
- Environment variable substitution for sensitive data
- Optional reverse proxy configuration (commented out by default)
- Proper security settings for a production environment

### Other Deployment Options

This application can also be deployed to platforms like Vercel, Netlify, or any other hosting service that supports Next.js.

When deploying, make sure to set the environment variables in your hosting provider's dashboard.

For the database, you can either:
- Use a managed PostgreSQL service (like AWS RDS, DigitalOcean Managed Databases, etc.)
- Run your own PostgreSQL instance
- Use a database-as-a-service provider (like Supabase, Neon, etc.)

## License

This project is licensed under the terms of the license included in the repository.
