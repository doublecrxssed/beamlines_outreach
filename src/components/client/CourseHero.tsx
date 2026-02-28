'use client'

import React from 'react'
import { motion } from 'framer-motion'

// Floating background physics runes for the Hero
const RUNES = [
    { id: 1, text: 'E=mc²', x: '10%', y: '20%', delay: 0 },
    { id: 2, text: 'Ψ', x: '80%', y: '15%', delay: 1.2 },
    { id: 3, text: 'H₀', x: '85%', y: '70%', delay: 0.5 },
    { id: 4, text: 'ν_e', x: '15%', y: '65%', delay: 2.1 },
    { id: 5, text: 'SU(3)', x: '50%', y: '10%', delay: 1.8 },
    { id: 6, text: 'G_{μν}', x: '45%', y: '85%', delay: 0.8 },
]

export function CourseHero({ lang = 'en' }: { lang?: string }) {

    const t = {
        titlePrefix: lang === 'hi' ? 'द' : 'The',
        titleHighlight: lang === 'hi' ? 'बीमलाइन्स आउटरीच' : 'Beamlines Outreach',
        titleSuffix: lang === 'hi' ? 'पाठ्यक्रम' : 'Curriculum',
        subtitle: lang === 'hi'
            ? 'क्वार्क से लेकर ब्रह्मांड तक भौतिकी के मूलभूत रहस्यों का अन्वेषण करें। इंटरैक्टिव सिमुलेशन जो क्वांटम यांत्रिकी और सापेक्षता को जीवन में लाते हैं।'
            : 'Explore the fundamental mysteries of physics, from quarks to the cosmos. Interactive simulations that bring quantum mechanics and relativity to life.',
        status: lang === 'hi' ? 'पाठ्यक्रम की प्रगति' : 'Course Progress'
    }

    return (
        <div className="relative w-full overflow-hidden border-b border-white/5 bg-space-950 pb-20 pt-32">

            {/* Ambient Deep Field Gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-neon-blue/10 blur-[120px] mix-blend-screen" />
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-neon-violet/10 blur-[120px] mix-blend-screen" />
            </div>

            {/* Subtle Grid Pattern Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Floating Math Runes */}
            {RUNES.map(rune => (
                <motion.div
                    key={rune.id}
                    className="absolute text-slate-700/30 font-mono text-2xl md:text-4xl font-bold select-none pointer-events-none z-0"
                    style={{ left: rune.x, top: rune.y }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: rune.delay
                    }}
                >
                    {rune.text}
                </motion.div>
            ))}

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12">

                    {/* Hero Copy */}
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
                                {t.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet">{t.titleHighlight}</span> {t.titleSuffix}
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto md:mx-0 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                            {t.subtitle}
                        </motion.p>
                    </div>

                </div>
            </div>
        </div>
    )
}
