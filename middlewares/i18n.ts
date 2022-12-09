// middlewares/i18n.ts
import acceptLanguage from "accept-language";
import { NextResponse } from "next/server";

import { NextMiddlewareWithParams, NextRequestWithParams } from "next-wayfinder";
import { fallbackLng, languages } from "../app/i18n/settings";

export const LNG_COOKIE_NAME = 'i18next'

export function getLanguage(req: NextRequestWithParams): string {
  let lng: string | null = null;

  if (req.cookies.has(LNG_COOKIE_NAME)) {
    lng = acceptLanguage.get(req.cookies.get(LNG_COOKIE_NAME)?.value)
  }

  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  }

  if (!lng) {
    // get it from the url 
    lng = req.params.lang as string ?? null
  }

  if (!lng) {
    lng = fallbackLng
  }

  return lng
}

const i18nMiddleware: NextMiddlewareWithParams = req => {
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') as string)
    const ref = languages.find((lang) => refererUrl.pathname.startsWith(`/${lang}`))

    const response = NextResponse.next()

    if (ref) {
      response.cookies.set(LNG_COOKIE_NAME, ref)
    }

    return response
  }


  return NextResponse.next()
}

export default i18nMiddleware;
