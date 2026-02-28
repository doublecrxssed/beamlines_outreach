'use client'

import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher() {
    const pathname = usePathname()
    const router = useRouter()

    const existingLangs = ['en', 'hi', 'ms', 'fr', 'es']
    const currentLang = pathname.split('/')[1] || 'en'

    const handleLanguageChange = (newLang: 'en' | 'hi' | 'ms' | 'fr' | 'es') => {
        if (newLang === currentLang) return

        // Create a regex to explicitly match the current language ONLY if it's the very first
        // folder segment in the URI path. This prevents `usePathname()` from accidentally
        // appending the paths randomly when the app directory hydrates.
        const regex = new RegExp(`^\/${currentLang}(\/|$)`)

        let newPath;
        if (regex.test(pathname)) {
            newPath = pathname.replace(regex, `/${newLang}$1`)
        } else {
            // Failsafe: if no existing language prefix is found, prepend the new language
            newPath = `/${newLang}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
            newPath = newPath.replace('//', '/')
        }

        router.push(newPath)
    }

    return (
        <div className="flex gap-2">
            {(['en', 'hi', 'ms', 'fr', 'es'] as const).map((lang) => (
                <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentLang === lang
                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        : 'bg-[#1E293B] text-slate-400 border border-white/10 hover:bg-[#334155]'
                        }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    )
}
