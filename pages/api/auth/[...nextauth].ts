import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
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
    // Use JWT strategy for sessions
    strategy: 'jwt',
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
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  
  // Events are useful for logging
  events: {},
  
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
});