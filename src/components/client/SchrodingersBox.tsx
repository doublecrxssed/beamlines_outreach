'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

type QuantumState = 'superposition' | 'up' | 'down'

export function SchrodingersBox({ lang = 'en' }: { lang?: string }) {
    const [particleState, setParticleState] = useState<QuantumState>('superposition')
    const [observations, setObservations] = useState<{ up: number, down: number }>({ up: 0, down: 0 })
    const [isComplete, setIsComplete] = useState(false)

    const MAX_OBSERVATIONS = 10

    const t = {
        title: lang === 'hi' ? 'श्रोडिंगर का बॉक्स' : 'Schrödinger\'s Box',
        observe: lang === 'hi' ? 'कण का अवलोकन करें' : 'Observe Particle',
        reset: lang === 'hi' ? 'रीसेट सुपरपोजिशन' : 'Reset Superposition',
        up: lang === 'hi' ? 'स्पिन अप' : 'Spin Up',
        down: lang === 'hi' ? 'स्पिन डाउन' : 'Spin Down',
        prob: lang === 'hi' ? 'प्रायिकता वितरण' : 'Probability Distribution',
        success: lang === 'hi' ? 'सांख्यिकीय प्रमाण प्राप्त!' : 'Statistical Proof Achieved!'
    }

    const observeParticle = () => {
        if (particleState !== 'superposition' || isComplete) return

        // 50/50 Quantum Flip
        const result = Math.random() > 0.5 ? 'up' : 'down'

        setParticleState(result)

        setObservations(prev => {
            const next = { ...prev, [result]: prev[result as keyof typeof prev] + 1 }

            // Check win condition
            if (next.up + next.down >= MAX_OBSERVATIONS && !isComplete) {
                setIsComplete(true)
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#3B82F6', '#EF4444']
                    })
                }, 500)
            }
            return next
        })
    }

    const resetState = () => {
        if (!isComplete) {
            setParticleState('superposition')
        }
    }

    const totalObs = observations.up + observations.down
    const upPercent = totalObs === 0 ? 50 : Math.round((observations.up / totalObs) * 100)
    const downPercent = totalObs === 0 ? 50 : Math.round((observations.down / totalObs) * 100)

    return (
        <div className="w-full max-w-2xl mx-auto my-12 bg-gray-900/40 p-1em rounded-3xl border border-white/5 backdrop-blur-xl group">
            <h3 className="text-xl font-display font-medium text-white/80 mb-6 px-1em text-center">
                {t.title}
            </h3>

            {/* The Box */}
            <div className="relative w-full aspect-square max-h-[300px] mb-8 bg-black/60 rounded-2xl border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center overflow-hidden">

                {/* The Particle */}
                <AnimatePresence mode="popLayout">
                    {particleState === 'superposition' && (
                        <motion.div
                            key="super"
                            initial={{ scale: 0.8, filter: 'blur(20px)', opacity: 0 }}
                            animate={{ scale: 1, filter: 'blur(15px)', opacity: 1 }}
                            exit={{ scale: 1.5, filter: 'blur(0px)', opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-red-500 animate-pulse mix-blend-screen"
                        />
                    )}

                    {particleState === 'up' && (
                        <motion.div
                            key="up"
                            initial={{ scale: 0, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="w-24 h-24 rounded-full bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center text-4xl font-black text-white"
                        >
                            ↑
                        </motion.div>
                    )}

                    {particleState === 'down' && (
                        <motion.div
                            key="down"
                            initial={{ scale: 0, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="w-24 h-24 rounded-full bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)] flex items-center justify-center text-4xl font-black text-white"
                        >
                            ↓
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={observeParticle}
                    disabled={particleState !== 'superposition' || isComplete}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold tracking-wide transition-colors"
                >
                    {t.observe}
                </button>
                <button
                    onClick={resetState}
                    disabled={particleState === 'superposition' || isComplete}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold tracking-wide transition-colors"
                >
                    {t.reset}
                </button>
            </div>

            {/* Statistical Tracker (Tug of War) */}
            <div className="px-1em">
                <div className="flex justify-between text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                    <span className="text-blue-400">{t.up} ({upPercent}%)</span>
                    <span className="text-red-400">{t.down} ({downPercent}%)</span>
                </div>
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex relative">
                    <motion.div
                        className="h-full bg-blue-500"
                        animate={{ width: `${upPercent}%` }}
                        transition={{ duration: 0.5, type: 'spring' }}
                    />
                    <motion.div
                        className="h-full bg-red-500"
                        animate={{ width: `${downPercent}%` }}
                        transition={{ duration: 0.5, type: 'spring' }}
                    />
                    {/* Center Marker */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/50 -translate-x-1/2" />
                </div>

                <div className="text-center mt-4 text-sm text-slate-500 font-mono">
                    Observations: {totalObs} / {MAX_OBSERVATIONS}
                </div>
            </div>

            {/* Success Message */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 mx-1em p-4 bg-green-500/10 text-green-400 rounded-xl text-center font-bold text-sm tracking-wide ring-1 ring-green-500/30"
                    >
                        {t.success}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
