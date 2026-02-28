'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface PremiumLessonCardProps {
    id: string
    index: number
    label: string
    available: boolean
    lang: string
    completed?: boolean
}

export function PremiumLessonCard({ id, index, label, available, lang, completed }: PremiumLessonCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    // Calculate background radial gradient position tied to mouse
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
    }

    const t = {
        lesson: lang === 'hi' ? 'पाठ' : 'Lesson',
        locked: lang === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon',
        start: lang === 'hi' ? 'शुरू करें' : 'Start Lesson',
        completed: lang === 'hi' ? 'पूर्ण' : 'Completed'
    }

    // Different accents based on state
    const accentColor = completed
        ? 'rgba(16, 185, 129, 0.5)' // Emerald for completed
        : available
            ? 'rgba(59, 130, 246, 0.5)' // Blue for active
            : 'rgba(255, 255, 255, 0.05)' // Gray for locked

    const InnerContent = () => (
        <>
            {/* The Pointer-tracking Glow Background */}
            <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovered && available ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${accentColor}, transparent 40%)`
                }}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`font-bold tracking-widest uppercase text-xs md:text-sm transition-colors ${available ? 'text-neon-cyan' : 'text-slate-500'}`}>
                            {t.lesson} {index + 1}
                        </div>

                        {/* Status Dots */}
                        <div className="flex gap-1" title={completed ? t.completed : available ? 'Ready' : t.locked}>
                            {completed ? (
                                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                            ) : available ? (
                                <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            ) : (
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                            )}
                        </div>
                    </div>

                    <h3 className={`text-xl md:text-2xl font-bold mb-4 line-clamp-2 transition-colors ${available ? 'text-white' : 'text-slate-500'}`}>
                        {label}
                    </h3>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {available ? (
                        <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all border ${completed
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/20'
                            : 'bg-neon-blue/10 text-neon-blue border-neon-blue/30 group-hover:bg-neon-blue/20 group-hover:border-neon-cyan'
                            }`}>
                            <span>{completed ? t.completed : t.start}</span>
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center px-5 py-2 rounded-full bg-slate-800/50 text-slate-500 font-semibold text-sm border border-slate-700/50">
                            {t.locked}
                        </div>
                    )}
                </div>
            </div>

            {/* Subtle border overlay that also glows on hover */}
            <div
                className={`absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none border transition-colors duration-300 ${isHovered && available ? 'border-neon-blue/50' : 'border-white/10'
                    }`}
            />
        </>
    )

    // If available, wrapped in a Link. If not, just a div.
    const WrapperClass = `group relative h-[220px] md:h-[260px] p-6 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden glass-panel transition-all duration-300 ${available ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl' : 'grayscale opacity-70 cursor-not-allowed'
        }`

    // Framer Motion properties for the slight 3D hover entry animation
    const motionProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.05 }
    }

    if (available) {
        return (
            <Link href={`/${lang}/courses/${id}`} className="block">
                <motion.div
                    {...motionProps}
                    ref={cardRef}
                    className={WrapperClass}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <InnerContent />
                </motion.div>
            </Link>
        )
    }

    return (
        <motion.div
            {...motionProps}
            className={WrapperClass}
        >
            <InnerContent />
        </motion.div>
    )
}
