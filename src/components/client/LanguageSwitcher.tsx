'use client'

import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher() {
    const pathname = usePathname()
    const router = useRouter()

    const existingLangs = ['en', 'hi', 'ms', 'fr', 'es']
    const currentLang = pathname.split('/')[1]

    const handleLanguageChange = (newLang: 'en' | 'hi' | 'ms' | 'fr' | 'es') => {
        if (newLang === currentLang) return

        const segments = pathname.split('/')

        // Ensure the path correctly starts with a leading slash structure
        if (segments[0] !== '') segments.unshift('')

        // If the current path already has a language prefix, swap it. 
        // Otherwise, insert the new language right after the root slash.
        if (existingLangs.includes(segments[1])) {
            segments[1] = newLang
        } else {
            segments.splice(1, 0, newLang)
        }

        const newPath = segments.join('/')
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
