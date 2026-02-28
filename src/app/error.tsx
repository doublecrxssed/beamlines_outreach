'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Beamlines Global Error Boundary Caught:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
            <div className="glass-panel p-10 rounded-3xl max-w-lg w-full flex flex-col items-center gap-6 relative overflow-hidden ring-1 ring-red-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-neon-violet/10 -z-10 blur-xl" />

                <span className="text-6xl mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">⚠️</span>

                <h2 className="font-display font-bold text-3xl text-white">System Anomaly</h2>
                <p className="text-slate-400">
                    A critical error occurred while attempting to render this simulation module.
                </p>

                <button
                    onClick={() => reset()}
                    className="mt-4 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 transition-all duration-300 backdrop-blur-md"
                >
                    Reboot Module
                </button>
            </div>
        </div>
    )
}
