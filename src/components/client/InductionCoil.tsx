'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import confetti from 'canvas-confetti'

export function InductionCoil({ lang = 'en' }: { lang?: string }) {
    const parentRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)

    const [currentVelocity, setCurrentVelocity] = useState(0)
    const [totalSpikes, setTotalSpikes] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)

    // Calculate instantaneous velocity of the drag to power the lightbulb
    useEffect(() => {
        let lastX = x.get()
        let rafId: number

        const updateVelocity = () => {
            const currentX = x.get()
            // Very simplified velocity diff
            const diff = Math.abs(currentX - lastX)

            // Artificial decay if we stop dragging
            setCurrentVelocity((prev) => {
                const updated = prev * 0.8 + diff * 2
                return Math.min(Math.max(updated, 0), 100) // clamp 0-100
            })

            lastX = currentX

            if (diff > 10 && !isSuccess) {
                setTotalSpikes(prev => {
                    const newTotal = prev + 1
                    if (newTotal > 80 && !isSuccess) {
                        setIsSuccess(true)
                        confetti({
                            particleCount: 100,
                            spread: 60,
                            origin: { y: 0.7 },
                            colors: ['#FBBF24', '#FFFFFF']
                        })
                    }
                    return newTotal
                })
            }

            rafId = requestAnimationFrame(updateVelocity)
        }

        rafId = requestAnimationFrame(updateVelocity)
        return () => cancelAnimationFrame(rafId)
    }, [x, isSuccess])

    const t = {
        title: lang === 'hi' ? 'फैराडे का प्रेरण' : 'Faraday\'s Induction',
        drag: lang === 'hi' ? 'चुंबक को ड्रैग करें' : 'Drag the Magnet',
        success: lang === 'hi' ? 'शक्ति उत्पन्न! लाइटबल्ब चालू है।' : 'Power Generated! Lightbulb ON.'
    }

    // Dynamic Coil Glowing based on drag velocity
    const coilGlow = currentVelocity > 20
        ? `0 0 ${currentVelocity}px rgba(251, 191, 36, ${currentVelocity / 100})`
        : 'none'

    return (
        <div className="w-full max-w-2xl mx-auto my-12 bg-gray-900/40 p-1em rounded-3xl border border-white/5 backdrop-blur-xl group flex flex-col items-center">
            <h3 className="text-xl font-display font-medium text-white/80 mb-6 w-full text-center">
                {t.title}
            </h3>

            {/* The Lightbulb (Target Output) */}
            <div className="relative mb-8 text-center">
                <div
                    className="w-16 h-16 mx-auto rounded-full transition-all duration-300 relative z-20 flex items-center justify-center border border-white/10"
                    style={{
                        backgroundColor: isSuccess ? '#FBBF24' : '#1e293b',
                        boxShadow: isSuccess ? '0 0 60px #FBBF24' : 'none'
                    }}
                >
                    <div className="w-8 h-8 rounded-full bg-white/50" />
                </div>
                <div className="w-4 h-6 bg-slate-700 mx-auto rounded-b-md relative z-10" />

                {/* Spikes Counter UI */}
                <div className="absolute top-1/2 -right-24 -translate-y-1/2 text-xs font-mono text-slate-500 whitespace-nowrap">
                    Energy: <span className={isSuccess ? 'text-amber-400' : 'text-slate-300'}>{totalSpikes}</span> / 80
                </div>
            </div>

            {/* The Interactive Zone (Coil + Magnet) */}
            <div ref={parentRef} className="relative w-full h-[150px] bg-black/40 rounded-2xl border-2 border-slate-800 shadow-inner flex items-center px-[4em] overflow-hidden">

                {/* The Copper Wire Coil (Static Center) */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 w-32 h-32 rounded-3xl bg-amber-900/20 border-8 border-amber-600/80 z-0 transition-shadow duration-75"
                    style={{ boxShadow: coilGlow }}
                />

                {/* The Galvanometer Gauge UI (Background Detail) */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <span className="text-red-400">-{Math.round(currentVelocity)}mA</span>
                    |
                    <span className="text-blue-400">+{Math.round(currentVelocity)}mA</span>
                </div>

                {/* The Draggable Magnet */}
                <motion.div
                    drag="x"
                    dragConstraints={parentRef}
                    dragElastic={0.1}
                    style={{ x }}
                    className="absolute cursor-grabbing z-10 flex select-none"
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                >
                    <div className="w-16 h-10 bg-red-600 rounded-l-md flex items-center justify-center text-white/80 font-bold border border-red-500 shadow-md">N</div>
                    <div className="w-16 h-10 bg-blue-600 rounded-r-md flex items-center justify-center text-white/80 font-bold border border-blue-500 shadow-md">S</div>
                </motion.div>

                {/* Visual affordance tooltip */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-slate-500/50 flex gap-2">
                    <span>←</span>{t.drag}<span>→</span>
                </div>
            </div>

            {/* Progress/Success State */}
            <div className="mt-8 px-1em w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isSuccess ? 1 : 0, scale: isSuccess ? 1 : 0.95 }}
                    className="w-full p-4 rounded-xl text-center font-bold text-sm tracking-wide bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
                >
                    {t.success}
                </motion.div>
            </div>
        </div>
    )
}
