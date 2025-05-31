# XIV Voices Admin

An Admin Panel and API service for the XIV Voices plugin.

## Features

- Next.js with TypeScript
- Discord OAuth authentication

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- Discord Developer Account

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/XivVoicesAdmin.git
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
cp .env.local.example .env.local
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This application can be deployed to platforms like Vercel, Netlify, or any other hosting service that supports Next.js.

When deploying, make sure to set the environment variables in your hosting provider's dashboard.

## License

This project is licensed under the terms of the license included in the repository.
