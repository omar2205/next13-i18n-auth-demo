import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      firstName: string
      lastName: string
      // role: 'OWNER' | 'SCHOOL' | 'TEACHER' | 'PARENT'
      // status: 'ACTIVE' | 'INACTIVE'
      role: string
      status: string
    } & DefaultSession['user']
  }
  interface AdapterUser extends User {
    id: string
    email: string
    emailVerified: Date | null
    role: string
  }
  interface User {
    role: string
    status: string
    firstName: string
    lastName: string
  }
}
