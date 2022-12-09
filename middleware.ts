import { NextRequest, NextResponse, NextMiddleware } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages } from './app/i18n/settings'
import { handlePaths } from 'next-wayfinder'
import i18nMiddleware, { getLanguage } from './middlewares/i18n'

acceptLanguage.languages(languages)

const cookieName = 'i18next'



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
