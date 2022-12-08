import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const URL = process.env.BACKEND_URL

export const authOptions = {}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds, _req) {
        const u = `${URL}/auth/login`
        const res = await fetch(u, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: creds?.email,
            password: creds?.password,
          }),
        })

        const user = await res.json()
        if (res.ok && user) {
          return user
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.status = user?.status
        token.role = user?.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.status = token.status as string
      session.user.role = token.role as string
      return session
    },
  },
})

