import { create } from 'zustand'

export type MathLevel = 'no-math' | 'light-math' | 'full-math'
export type Language = 'en' | 'hi' | 'ms' | 'fr' | 'es'

interface AppState {
    // STRICT UI State
    mathLevel: MathLevel
    setMathLevel: (level: MathLevel) => void

    // Progress State
    localProgress: number
    isComplete: boolean
    incrementProgress: (topicId: string, currentMath: string) => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
    mathLevel: 'no-math', // Default safe initialization
    setMathLevel: (level) => set({ mathLevel: level }),

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

                // Phase 9 hooks for Confetti will check isComplete here
            }
        } catch (e) {
            console.error('Failed to log progress', e)
        }
    }
}))
