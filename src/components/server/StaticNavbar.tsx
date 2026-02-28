import Link from 'next/link'
import { LanguageSwitcher } from '../client/LanguageSwitcher'
import { ProgressRing } from '../client/ProgressRing'

export function StaticNavbar() {
    return (
        <nav className="sticky top-0 z-50 w-full glass-card border-b-0">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="font-[family-name:var(--font-outfit)] font-bold text-xl tracking-wide flex items-center gap-3">
                    <span className="text-neon-blue drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">🌌</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Beamlines Outreach
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <ProgressRing />
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    )
}
