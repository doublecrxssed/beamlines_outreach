'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/useAppStore'

export function A11yProvider() {
    const isHighContrast = useAppStore((state) => state.isHighContrast)
    const isDyslexicFont = useAppStore((state) => state.isDyslexicFont)
    const isReducedMotion = useAppStore((state) => state.isReducedMotion)
    const isScreenReaderMode = useAppStore((state) => state.isScreenReaderMode)

    const [mounted, setMounted] = useState(false)

    // Only run on client after hydration
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const root = document.documentElement

        if (isHighContrast) root.setAttribute('data-theme', 'high-contrast')
        else root.removeAttribute('data-theme')

        if (isDyslexicFont) root.setAttribute('data-font', 'dyslexic')
        else root.removeAttribute('data-font')

        if (isReducedMotion) root.setAttribute('data-reduced-motion', 'true')
        else root.removeAttribute('data-reduced-motion')

        if (isScreenReaderMode) root.setAttribute('data-screen-reader', 'true')
        else root.removeAttribute('data-screen-reader')

    }, [isHighContrast, isDyslexicFont, isReducedMotion, isScreenReaderMode, mounted])

    return null
}
