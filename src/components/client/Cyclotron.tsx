'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export function Cyclotron({ lang = 'en' }: { lang?: string }) {
    const [electricField, setElectricField] = useState(0)
    const [magneticField, setMagneticField] = useState(0)

    // Derived State (Solves setState-in-effect warning)
    const isSuccess = electricField > 85 && magneticField > 85 && Math.abs(electricField - magneticField) < 10
    const errorState = !isSuccess && (electricField > 90 || magneticField > 90)

    // Imperative Side Effect (Solves ref-during-render warning)
    useEffect(() => {
        if (isSuccess) {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#3B82F6', '#8B5CF6']
            })
        }
    }, [isSuccess])

    const t = {
        title: lang === 'hi' ? 'साइक्लोट्रॉन ट्यूनिंग' : 'Cyclotron Tuning',
        elec: lang === 'hi' ? 'विद्युत क्षेत्र (गति)' : 'Electric Field (Speed)',
        mag: lang === 'hi' ? 'चुंबकीय क्षेत्र (स्टीयरिंग)' : 'Magnetic Field (Steering)',
        success: lang === 'hi' ? 'अनुनाद प्राप्त हुआ! कण उत्सर्जित।' : 'Resonance Achieved! Particle Ejected.',
        fail: lang === 'hi' ? 'सिंक्रनाइज़ेशन खो गया. दीवार से टकराव!' : 'Desynchronization. Wall Collision!'
    }

    // Dynamic spiral logic based on sliders
    const scale = 1 + (electricField / 100) * 1.5           // Electric Field determines outer size
    const rotation = (magneticField / 100) * 1080          // Magnetic field determines tightness/rotation speed

    // Safety clamp to prevent infinite CSS recalculations
    const clampedScale = Math.min(Math.max(scale, 1), 2.5);
    const clampedRotation = Math.min(Math.max(rotation, 0), 1080);

    // Trajectory Color: Orange (Fast/Electric) vs Blue (Tight/Magnetic)
    const trailColor = electricField > magneticField + 20 ? 'rgba(249, 115, 22, 0.4)' : 'rgba(139, 92, 246, 0.4)'

    return (
        <div className="w-full max-w-2xl mx-auto my-12 bg-gray-900/40 p-1em rounded-3xl border border-white/5 backdrop-blur-xl group">
            <h3 className="text-xl font-display font-medium text-white/80 mb-6 px-1em text-center">
                {t.title}
            </h3>

            {/* Cyclotron Visualizer */}
            <div className="relative w-full aspect-square max-h-[400px] mb-8 bg-black/40 rounded-full border-4 border-slate-800 shadow-inner flex items-center justify-center overflow-hidden">
                {/* D-Plates Grid Overlay */}
                <div className="absolute inset-0 w-full h-full border-b-2 border-slate-700/50 -rotate-45 z-0" />
                <div className="absolute inset-0 w-full h-full border-r-2 border-slate-700/50 -rotate-45 z-0" />

                {/* Error Flash */}
                <motion.div
                    animate={{ opacity: errorState ? 0.3 : 0 }}
                    className="absolute inset-0 bg-red-500 z-0 mix-blend-screen pointer-events-none"
                    transition={{ duration: 0.1 }}
                />

                {/* The Spiral / Particle Path */}
                <motion.div
                    className="absolute rounded-full border border-dashed z-10"
                    style={{ borderColor: trailColor }}
                    animate={{
                        width: `${clampedScale * 30}%`,
                        height: `${clampedScale * 30}%`,
                        rotate: clampedRotation,
                        opacity: (electricField > 10 || magneticField > 10) ? 1 : 0
                    }}
                    transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                >
                    {/* The physical proton particle traveling the path */}
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-neon-cyan shadow-[0_0_15px_#22d3ee] animate-pulse" />
                </motion.div>

                {/* Target Ejection Port (Lights up on success) */}
                <div className={`absolute top-0 right-0 w-12 h-12 bg-slate-800 border-l-2 border-b-2 border-slate-700 rounded-bl-3xl z-20 transition-all duration-500 ${isSuccess ? 'bg-green-500/20 shadow-[inset_0_0_30px_#22c55e]' : ''}`} />
            </div>

            {/* Tactile Sliders Panel */}
            <div className="flex gap-1em px-1em pb-1em justify-center">
                {/* Electric Slider */}
                <div className="flex flex-col items-center flex-1 max-w-[200px]">
                    <span className="text-xs uppercase tracking-widest text-slate-400 mb-4">{t.elec}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={electricField}
                        onChange={(e) => setElectricField(Number(e.target.value))}
                        className="w-full accent-orange-500 hover:accent-orange-400 transition-all"
                    />
                </div>

                {/* Magnetic Slider */}
                <div className="flex flex-col items-center flex-1 max-w-[200px]">
                    <span className="text-xs uppercase tracking-widest text-slate-400 mb-4">{t.mag}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={magneticField}
                        onChange={(e) => setMagneticField(Number(e.target.value))}
                        className="w-full accent-violet-500 hover:accent-violet-400 transition-all"
                    />
                </div>
            </div>

            {/* Validation Feedback Status Card */}
            <div className="mt-4 px-1em">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: (isSuccess || errorState) ? 1 : 0, y: (isSuccess || errorState) ? 0 : 10 }}
                    className={`w-full p-4 rounded-xl text-center font-bold text-sm tracking-wide ${isSuccess ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
                >
                    {isSuccess ? t.success : (errorState ? t.fail : '')}
                </motion.div>
            </div>
        </div>
    )
}
