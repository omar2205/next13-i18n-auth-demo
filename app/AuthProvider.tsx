'use client'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

interface IAuthProviderProps {
  children: React.ReactNode
  session: Session | null
}

export default function({ children, session }: IAuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
