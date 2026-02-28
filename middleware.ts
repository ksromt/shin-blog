import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Detect locale from geo-IP country headers.
 * Supports: Vercel (x-vercel-ip-country), Cloudflare (cf-ipcountry),
 * custom reverse proxy (x-country-code).
 *
 * Mapping: Japan → ja, China → zh, everywhere else → null (fall through
 * to next-intl's built-in Accept-Language detection).
 */
function detectLocaleFromHeaders(request: NextRequest): string | null {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    null;

  if (!country) return null;

  const upper = country.toUpperCase();
  if (upper === 'JP') return 'ja';
  if (upper === 'CN') return 'zh';
  return null;
}

export default function middleware(request: NextRequest) {
  // If user already has a locale preference (cookie set by next-intl or
  // the LocaleSwitcher), respect it — no geo detection override.
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie) {
    return intlMiddleware(request);
  }

  // First-time visitor: try IP/geo-based locale detection
  const detectedLocale = detectLocaleFromHeaders(request);
  if (detectedLocale) {
    // Inject the locale preference into the request so next-intl picks it up
    request.cookies.set('NEXT_LOCALE', detectedLocale);
    const response = intlMiddleware(request);
    // Persist the cookie for future visits (1 year)
    response.cookies.set('NEXT_LOCALE', detectedLocale, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  // Fall through to next-intl's built-in Accept-Language detection
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except: api, _next, admin, auth, static files, feed, sitemap, robots
  matcher: [
    '/((?!api|_next|arcadiaedenAdmin|auth|feed\\.xml|sitemap\\.xml|robots\\.txt|favicon\\.ico|icon\\.png|.*\\..*).*)',
  ],
};
