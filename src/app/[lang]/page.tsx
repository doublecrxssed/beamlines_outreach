import Link from 'next/link'

const LESSONS = [
    { id: 'standard-model', label: 'The Standard Model', available: true },
    { id: 'particle-accelerators', label: 'Particle Accelerators', available: true },
    { id: 'electromagnetism', label: 'Electromagnetism', available: true },
    { id: 'quantum-states', label: 'Quantum States', available: true },
    { id: 'special-relativity', label: 'Special Relativity', available: true },
    { id: 'higgs-field', label: 'The Higgs Field', available: true },
    { id: 'dark-matter', label: 'Dark Matter & Energy', available: true },
    { id: 'neutrino-oscillations', label: 'Neutrino Oscillations', available: true },
    { id: 'quantum-chromodynamics', label: 'Quantum Chromodynamics', available: true },
    { id: 'grand-unified-theory', label: 'Grand Unified Theory', available: true },
]

export default async function CourseHub({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params

    // Simple static translations
    const t = {
        title: lang === 'hi' ? 'पाठ्यक्रम' : 'Course Modules',
        subtitle: lang === 'hi' ? 'ब्रह्मांड के रहस्यों को अनलॉक करें।' : 'Unlock the mysteries of the universe.',
        lesson: lang === 'hi' ? 'पाठ' : 'Lesson',
        locked: lang === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon',
        start: lang === 'hi' ? 'शुरू करें' : 'Start Lesson'
    }

    return (
        <main className="container mx-auto px-6 py-24 max-w-5xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet mb-4 drop-shadow-sm">
                    {t.title}
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {LESSONS.map((lesson, index) => (
                    <div
                        key={lesson.id}
                        className={`glass-panel rounded-3xl p-8 relative overflow-hidden transition-all duration-300 ${lesson.available
                            ? 'hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-white/10 cursor-pointer group'
                            : 'opacity-60 grayscale cursor-not-allowed border border-white/5'
                            }`}
                    >
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                            {lesson.available ? (
                                <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                            ) : (
                                <div className="w-3 h-3 rounded-full bg-slate-600" />
                            )}
                        </div>

                        <div className={`font-bold tracking-widest uppercase text-sm mb-2 transition-colors ${lesson.available ? 'text-neon-blue group-hover:text-neon-cyan' : 'text-slate-500'}`}>
                            {t.lesson} {index + 1}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">
                            {lesson.label}
                        </h3>

                        <div className="mt-8">
                            {lesson.available ? (
                                <Link
                                    href={`/${lang}/${lesson.id}`}
                                    className="inline-block px-6 py-2 rounded-full bg-neon-blue/20 text-neon-blue font-semibold border border-neon-blue/50 group-hover:bg-neon-blue/30 group-hover:border-neon-cyan transition-all"
                                >
                                    {t.start}
                                </Link>
                            ) : (
                                <div className="inline-block px-6 py-2 rounded-full bg-slate-800/50 text-slate-400 font-semibold border border-slate-700">
                                    {t.locked}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
