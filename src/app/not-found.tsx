'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
            <div className="glass-panel p-10 rounded-3xl max-w-lg w-full flex flex-col items-center gap-6 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 to-neon-blue/10 -z-10 blur-xl" />

                <span className="text-6xl mb-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">🌌</span>

                <h2 className="font-display font-bold text-3xl text-white">Lost in Space</h2>
                <p className="text-slate-400">
                    We couldn&apos;t find the physics simulation or topic you were looking for.
                    It might have decayed into a different route, or never existed at all!
                </p>

                <Link
                    href="/"
                    className="mt-4 px-6 py-3 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-semibold hover:bg-neon-blue/20 transition-all duration-300 backdrop-blur-md"
                >
                    Return to Base
                </Link>
            </div>
        </div>
    )
}
