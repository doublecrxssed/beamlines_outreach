'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/useAppStore'
import { Eye, EyeOff } from 'lucide-react'

export function HighContrastToggle() {
    const isHighContrast = useAppStore((state) => state.isHighContrast)
    const toggleHighContrast = useAppStore((state) => state.toggleHighContrast)
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-10 h-10" /> // Placeholder to prevent layout shift
    }

    return (
        <button
            onClick={toggleHighContrast}
            className={`p-2 rounded-full transition-colors flex items-center justify-center
                ${isHighContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            aria-label={isHighContrast ? "Disable High Contrast" : "Enable High Contrast"}
            title={isHighContrast ? "Disable High Contrast" : "Enable High Contrast"}
        >
            {isHighContrast ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
    )
}
