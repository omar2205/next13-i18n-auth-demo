'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { languages } from '../i18n/settings'


export default function({ params }: PageProps) {
  const s = useSession()

  console.log({ s })

  return <>
    <div
      className="flex flex-col gap-4 justify-center align-center 
        h-screen max-w-lg mx-auto text-center"
    >
      <h1 className="text-3xl font-bold">title</h1>
      <p>sub</p>
      <Link
        className="p-2 mx-auto w-48 rounded 
          bg-green-800 hover:bg-green-700"
        href="/login"
      >
        login
      </Link>
    </div>
  </>
}
