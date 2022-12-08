import { NextRequest, NextResponse, NextMiddleware } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages } from './app/i18n/settings'
import { pathToRegexp } from 'path-to-regexp'

acceptLanguage.languages(languages)

const cookieName = 'i18next'

export function i18nMiddleware(req: NextRequest) {
  let lng
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(`/${lng}`, req.url))
  }

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

type Middleware = {
  matcher: string | string[] | RegExp
  handler: NextMiddleware
}

function handlePaths(middlewares: Middleware[]): NextMiddleware {
  return async function(req, ev) {
    const path = req.nextUrl.pathname
    const middleware = middlewares.find((m) =>
      pathToRegexp(m.matcher).test(path),
    )

    if (middleware) {
      return middleware.handler(req, ev)
    }

    // if there's no middleware just continue
    return NextResponse.next()
  }
}

const DASHBOARD_URL = '/api/auth/signin?callbackUrl=%2Fdashboard'

export const middleware: NextMiddleware = handlePaths([
  {
    matcher: ['/'].concat(languages.map((l) => `/${l}/`)),
    handler: (req) => i18nMiddleware(req),
  },
  {
    matcher: ['/sign-in', '/login'],
    handler: (req: NextRequest) =>
      NextResponse.redirect(new URL(DASHBOARD_URL, req.url)),
  },
])
