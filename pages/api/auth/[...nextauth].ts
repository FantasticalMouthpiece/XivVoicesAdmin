import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      // Request additional permissions from Discord
      authorization: {
        params: {
          scope: 'identify email guilds',
        },
      },
    }),
    // Add more providers here if needed
  ],
  // Database is optional - if not specified, NextAuth.js will use JWT for sessions
  // database: process.env.DATABASE_URL,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    // Use database strategy for sessions when using an adapter
    strategy: 'database',
    // Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
  // option is set - or by default if no database is specified.
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },

  // You can define custom pages to override the built-in ones
  pages: {
    signIn: '/', // Use the home page for sign in
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the Discord access_token to the token right after sign in
      if (account?.provider === 'discord') {
        token.accessToken = account.access_token;
        token.discordProfile = profile;
      }
      return token;
    },
    async session({ session, token, user }) {
      // With database sessions, the user object is available
      if (user) {
        // Add user properties to the session
        session.user.id = user.id;
        session.user.discordId = user.discordId;
        session.user.role = user.role;

        // If we still have access to the token (during the transition), get the access token
        if (token?.accessToken) {
          session.accessToken = token.accessToken as string;
        }
      } else if (token) {
        // Fallback for JWT strategy if we switch back
        session.accessToken = token.accessToken as string;
      }

      return session;
    },
  },

  // Events are useful for logging
  events: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        try {
          // Update user with Discord-specific information
          await prisma.user.update({
            where: { id: user.id },
            data: {
              discordId: profile.id as string,
              // Add any other Discord profile data you want to store
            },
          });
        } catch (error) {
          console.error('Error updating user with Discord data:', error);
        }
      }
    },
  },

  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
});
