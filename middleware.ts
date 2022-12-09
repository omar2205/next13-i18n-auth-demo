import { NextRequest, NextResponse, NextMiddleware } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages } from './app/i18n/settings'
import { handlePaths } from 'next-wayfinder'
import { getLanguage } from './middlewares/i18n'

acceptLanguage.languages(languages)

const cookieName = 'i18next'

export function i18nMiddleware(req: NextRequest) {
  let lng
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') as string)
    const lngInReferer = languages.find((l: string) =>
      refererUrl.pathname.startsWith(`/${l}`),
    )
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next()
}


const DASHBOARD_URL = '/api/auth/signin?callbackUrl=%2Fdashboard'

export const middleware: NextMiddleware = handlePaths([
  {
    matcher: languages.map(l => `/${l}`),
    handler: i18nMiddleware,
  },
  {
    matcher: '/',
    handler: req => {
      const lng = getLanguage(req)
      return NextResponse.redirect(new URL(`/${lng}`, req.url))
    }
  },
  {
    matcher: ['/sign-in', '/login'],
    handler: req =>
      NextResponse.redirect(new URL(DASHBOARD_URL, req.url)),
  },
])
