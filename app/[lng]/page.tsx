'use client'
import { use } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslation } from '../i18n/client'
import { languages } from '../i18n/settings'

const Lang = ({ lng }: { lng: string }) => {
  const links = languages.filter(l => l !== lng)
  return <>{links.map(l => <Link key={l} href={`/${l}`}>{l}</Link>)}</>
}


export default function({ params }: PageProps) {
  const { t } = useTranslation(params.lng, 'login', {})

  const s = useSession()

  console.log({ s })

  return <>
    <div
      className="flex flex-col gap-4 justify-center align-center 
        h-screen max-w-lg mx-auto text-center"
    >
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <Link
        className="p-2 mx-auto w-48 rounded 
          bg-green-800 hover:bg-green-700"
        href="/login"
      >
        {t('login')}
      </Link>
    </div>
    <footer className="absolute top-0">
      <pre>
        {JSON.stringify(s.data, null, 2)}
      </pre>
      <Lang lng={params.lng} />
    </footer>
  </>
}
