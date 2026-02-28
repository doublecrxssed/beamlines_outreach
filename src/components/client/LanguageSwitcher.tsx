'use client'

import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher() {
    const pathname = usePathname()
    const router = useRouter()

    // Extract current language from URL (e.g., from "/en/courses/standard-model" -> "en")
    const currentLang = pathname.split('/')[1] as 'en' | 'hi' | 'ms' | 'fr' | 'es'

    const handleLanguageChange = (newLang: 'en' | 'hi' | 'ms' | 'fr' | 'es') => {
        if (newLang === currentLang) return

        // Hard-replace the language prefix in the URL
        // e.g., "/en/courses/standard-model" -> "/hi/courses/standard-model"
        const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`)

        // Explicit router.push() forces the Next.js server to re-render the page
        // and fetch the correct translated MDX file, solving the MVP bug.
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
