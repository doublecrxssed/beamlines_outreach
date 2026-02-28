import { CourseHero } from '@/components/client/CourseHero'
import { PremiumLessonCard } from '@/components/client/PremiumLessonCard'

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

    // Translations
    const t = {
        m1Title: lang === 'hi' ? 'मॉड्यूल 1: द कोर' : 'Module 1: The Core',
        m1Desc: lang === 'hi' ? 'पदार्थ और मूलभूत शक्तियों के निर्माण खंडों का अन्वेषण करें।' : 'Explore the building blocks of matter and the fundamental forces.',
        m2Title: lang === 'hi' ? 'मॉड्यूल 2: द्रव्यमान, स्थान और समय' : 'Module 2: Mass, Space & Time',
        m2Desc: lang === 'hi' ? 'सापेक्षता, द्रव्यमान की उत्पत्ति और अदृश्य ब्रह्मांड के झुकने को समझें।' : 'Understand the bending of relativity, the origins of mass, and the invisible universe.',
        m3Title: lang === 'hi' ? 'मॉड्यूल 3: एकीकृत ब्रह्मांड' : 'Module 3: The Unified Universe',
        m3Desc: lang === 'hi' ? 'उन्नत क्वांटम गतिकी और सभी भौतिकी का भव्य एकीकरण।' : 'Advanced quantum dynamics and the grand unification of all physics.'
    }

    // Grouping logic
    const module1 = LESSONS.slice(0, 5)   // 1 to 5
    const module2 = LESSONS.slice(5, 7)   // 6 to 7
    const module3 = LESSONS.slice(7, 10)  // 8 to 10

    return (
        <main className="min-h-screen bg-[#050810] pb-24 text-white">

            <CourseHero lang={lang} />

            <div className="container mx-auto px-6 max-w-6xl mt-24">

                {/* Module 1 */}
                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-bold text-white mb-2">{t.m1Title}</h2>
                        <p className="text-slate-400">{t.m1Desc}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {module1.map((lesson, idx) => (
                            <PremiumLessonCard
                                key={lesson.id}
                                id={lesson.id}
                                index={idx}
                                label={lesson.label}
                                available={lesson.available}
                                lang={lang}
                            />
                        ))}
                    </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24" />

                {/* Module 2 */}
                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-bold text-white mb-2">{t.m2Title}</h2>
                        <p className="text-slate-400">{t.m2Desc}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {module2.map((lesson, idx) => (
                            <PremiumLessonCard
                                key={lesson.id}
                                id={lesson.id}
                                index={idx + 5}
                                label={lesson.label}
                                available={lesson.available}
                                lang={lang}
                            />
                        ))}
                    </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24" />

                {/* Module 3 */}
                <section className="mb-24">
                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-bold text-white mb-2">{t.m3Title}</h2>
                        <p className="text-slate-400">{t.m3Desc}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {module3.map((lesson, idx) => (
                            <PremiumLessonCard
                                key={lesson.id}
                                id={lesson.id}
                                index={idx + 7}
                                label={lesson.label}
                                available={lesson.available}
                                lang={lang}
                            />
                        ))}
                    </div>
                </section>

            </div>
        </main>
    )
}
