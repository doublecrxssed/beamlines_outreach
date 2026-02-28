import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'hi']
const defaultLocale = 'en'

// Helper to get locale from Accept-Language header
function getLocale(request: NextRequest) {
    const acceptLanguage = request.headers.get('accept-language')
    if (!acceptLanguage) return defaultLocale

    // Basic parser: pick the first matched locale we support
    const preferredLocales = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().substring(0, 2))
    for (const locale of preferredLocales) {
        if (locales.includes(locale)) return locale
    }

    return defaultLocale
}

export function proxy(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl

    // Skip logic for static files, API routes, Next internal APIs, and images
    if (
        pathname.includes('.') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next')
    ) {
        return NextResponse.next()
    }

    let response: NextResponse

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) {
        response = NextResponse.next()
    } else {
        // Redirect if there is no locale
        const locale = getLocale(request)
        request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
        response = NextResponse.redirect(request.nextUrl)
    }

    // Apply the frictionless Auth Cookie explicitly to the response object BEFORE returning
    let deviceId = request.cookies.get('deviceId')?.value

    if (!deviceId) {
        deviceId = crypto.randomUUID()
        response.cookies.set({
            name: 'deviceId',
            value: deviceId,
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: true, // Secure
            sameSite: 'lax',
        })
    }

    return response
}
export const config = {
    matcher: [
        // Skip all internal paths and static uploads
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
}
