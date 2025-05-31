import type { User as DBUser } from "@/generated/prisma";

declare module 'next-auth' {
  interface User extends DBUser {}

  export interface AdapterUser extends DBUser {
    name: string,
  }

  interface Account {
  }

  // Discord User Profile Information
  interface Profile {
    id: string,
    name: string,
    email: string,
    image: string
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string;
    user: DBUser;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken?: string;
    discordProfile?: any;
  }
}
