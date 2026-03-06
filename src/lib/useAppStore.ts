import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MathLevel = 'no-math' | 'light-math' | 'full-math'
export type Language = 'en' | 'hi' | 'ms' | 'fr' | 'es'

interface AppState {
    // STRICT UI State
    mathLevel: MathLevel
    setMathLevel: (level: MathLevel) => void

    // Accessibility State
    isHighContrast: boolean
    toggleHighContrast: () => void
    isDyslexicFont: boolean
    toggleDyslexicFont: () => void
    isReducedMotion: boolean
    toggleReducedMotion: () => void
    isScreenReaderMode: boolean
    toggleScreenReaderMode: () => void
    isLargeText: boolean
    toggleLargeText: () => void

    // Progress State
    localProgress: number
    isComplete: boolean
    incrementProgress: (topicId: string, currentMath: string) => Promise<void>
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            mathLevel: 'no-math', // Default safe initialization
            setMathLevel: (level) => set({ mathLevel: level }),

            // A11y Initial State
            isHighContrast: false,
            toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
            isDyslexicFont: false,
            toggleDyslexicFont: () => set((state) => ({ isDyslexicFont: !state.isDyslexicFont })),
            isReducedMotion: false,
            toggleReducedMotion: () => set((state) => ({ isReducedMotion: !state.isReducedMotion })),
            isScreenReaderMode: false,
            toggleScreenReaderMode: () => set((state) => ({ isScreenReaderMode: !state.isScreenReaderMode })),
            isLargeText: false,
            toggleLargeText: () => set((state) => ({ isLargeText: !state.isLargeText })),

            localProgress: 0,
            isComplete: false,

            // Triggers the API call and visually updates the Navbar ring
            incrementProgress: async (topicId, currentMath) => {
                try {
                    const res = await fetch('/api/progress', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ topicId, mathLevelUsed: currentMath, interactionCount: 1 })
                    })

                    if (res.ok) {
                        const data = await res.json()
                        set({
                            localProgress: data.progress,
                            isComplete: data.isComplete
                        })
                    }
                } catch (e) {
                    console.error('Failed to log progress', e)
                }
            }
        }),
        {
            name: 'beamlines-storage',
            // Persist all accessibility preferences
            partialize: (state) => ({
                isHighContrast: state.isHighContrast,
                isDyslexicFont: state.isDyslexicFont,
                isReducedMotion: state.isReducedMotion,
                isScreenReaderMode: state.isScreenReaderMode,
                isLargeText: state.isLargeText
            }),
        }
    )
)
