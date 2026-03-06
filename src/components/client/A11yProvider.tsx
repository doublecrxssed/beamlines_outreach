'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/useAppStore'

export function A11yProvider() {
    const isHighContrast = useAppStore((state) => state.isHighContrast)
    const [mounted, setMounted] = useState(false)

    // Only run on client after hydration
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        if (isHighContrast) {
            document.documentElement.setAttribute('data-theme', 'high-contrast')
        } else {
            document.documentElement.removeAttribute('data-theme')
        }
    }, [isHighContrast, mounted])

    return null
}
