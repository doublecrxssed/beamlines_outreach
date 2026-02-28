'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LanguageSwitcher() {
    const pathname = usePathname()
    // currentLang acts as the highlight state.
    const currentLang = pathname.split('/')[1] || 'en'

    const getLocalizedPath = (lang: string) => {
        // Explicitly extract the starting language boundary:
        // Ex: "/en/courses..." matches "/en/", Group 2 is "/"
        // Ex: "/hi" matches "/hi", Group 2 is ""
        const langRegex = /^\/(en|hi|ms|fr|es)(\/|$)/

        if (langRegex.test(pathname)) {
            // Replaces the matched locale with the newly requested locale, preserving the trailing slash or EOF.
            return pathname.replace(langRegex, `/${lang}$2`)
        }

        // Failsafe: if no existing locale is detected in the URL, prepend the new language.
        const rawPath = pathname.startsWith('/') ? pathname : `/${pathname}`
        return `/${lang}${rawPath}`.replace('//', '/')
    }

    return (
        <div className="flex gap-2">
            {(['en', 'hi', 'ms', 'fr', 'es'] as const).map((lang) => (
                <Link
                    key={lang}
                    href={getLocalizedPath(lang)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentLang === lang
                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        : 'bg-[#1E293B] text-slate-400 border border-white/10 hover:bg-[#334155]'
                        }`}
                >
                    {lang.toUpperCase()}
                </Link>
            ))}
        </div>
    )
}
