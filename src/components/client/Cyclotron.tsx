'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export function Cyclotron({ lang = 'en' }: { lang?: string }) {
    const [electricField, setElectricField] = useState(0)
    const [magneticField, setMagneticField] = useState(0)
    const [hasCrashed, setHasCrashed] = useState(false)

    // Derived Logic Definitions
    const isSuccess = electricField > 85 && magneticField > 85 && Math.abs(electricField - magneticField) < 10 && !hasCrashed
    const rawError = (!isSuccess && (electricField > 90 || magneticField > 90)) || hasCrashed

    // Generate Parametric Spiral
    const spiralPath = useMemo(() => {
        const CX = 150
        const CY = 150
        const MAX_R = 125 // Wall radius
        let path = `M ${CX} ${CY}`

        let endX = CX
        let endY = CY
        let crashed = false

        // Electric Field drives how many total turns (Energy/Speed) we achieve (0 to 6 full turns)
        const maxTheta = (electricField / 100) * 12 * Math.PI

        // Magnetic Field drives how tightly the spiral winds (Steering)
        // Stronger Magnetic Field = smaller k (tighter spiral)
        const k = (150 - magneticField) * 0.04

        for (let theta = 0; theta <= maxTheta; theta += 0.2) {
            const r = k * theta
            if (r > MAX_R) {
                // Hit the wall
                crashed = true
                break
            }
            if (isSuccess && theta > 10 * Math.PI) {
                // Force the success trajectory smoothly out the exit port
                endX = CX + 140
                endY = CY
                path += ` L ${endX} ${endY}`
                break
            }

            endX = CX + r * Math.cos(theta)
            endY = CY + r * Math.sin(theta)
            path += ` L ${endX} ${endY}`
        }

        return { path, endX, endY, crashed: crashed && !isSuccess }
    }, [electricField, magneticField, isSuccess])

    const errorState = rawError || spiralPath.crashed

    // Triggers
    useEffect(() => {
        if (spiralPath.crashed && !hasCrashed) {
            setHasCrashed(true)
            setTimeout(() => {
                setHasCrashed(false)
                setElectricField(0)
                setMagneticField(0)
            }, 1000)
        }
    }, [spiralPath.crashed, hasCrashed])

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

    // Determine trail color (Orange if advancing too fast radially, Blue if steering tightly)
    const strokeColor = errorState ? '#ef4444' : (electricField > magneticField + 15 ? '#f97316' : '#00ffff')

    return (
        <div className="w-full max-w-2xl mx-auto my-12 backdrop-blur-xl bg-slate-900/50 p-6 md:p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl group">
            <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-6 text-center tracking-wide">
                {t.title}
                <span className="block text-xs text-slate-400 mt-2 font-sans uppercase tracking-[0.2em] font-medium">Trajectory Visualizer</span>
            </h3>

            {/* SVG CYCLOTRON DISPLAY - Explicitly Flat and Clear */}
            <div className="relative w-full aspect-square max-w-[400px] mx-auto mb-8 bg-black/60 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] border-[6px] border-slate-800 flex items-center justify-center overflow-hidden">

                {/* Error Flash Overlay */}
                <motion.div
                    animate={{ opacity: errorState ? 0.4 : 0 }}
                    className="absolute inset-0 bg-red-600 z-10 mix-blend-screen pointer-events-none"
                    transition={{ duration: 0.15 }}
                />

                <svg viewBox="0 0 300 300" className="w-full h-full p-6 drop-shadow-2xl">
                    <defs>
                        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        {/* Metallic gradient for Dees */}
                        <linearGradient id="deeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                    </defs>

                    {/* Ejection Port (Right edge) */}
                    <rect x="260" y="140" width="30" height="20" fill={isSuccess ? '#22c55e' : '#334155'} filter={isSuccess ? 'url(#neonGlow)' : ''} className="transition-colors duration-500" />
                    <text x="280" y="165" fill={isSuccess ? '#4ade80' : '#64748b'} fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">EXIT</text>

                    {/* Left Dee (D-Shape) */}
                    <path
                        d="M 145 15 A 135 135 0 0 0 145 285 L 145 15 Z"
                        fill="url(#deeMetal)"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeOpacity="0.4"
                    />

                    {/* Right Dee (D-Shape) */}
                    <path
                        d="M 155 15 A 135 135 0 0 1 155 285 L 155 15 Z"
                        fill="url(#deeMetal)"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeOpacity="0.4"
                    />

                    {/* Dynamic Spiral Trajectory line */}
                    {(electricField > 0 || magneticField > 0) && (
                        <>
                            <motion.path
                                d={spiralPath.path}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                                filter="url(#neonGlow)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ type: "spring", stiffness: 50, damping: 15 }}
                            />
                            {/* The Proton Particle */}
                            <circle
                                cx={spiralPath.endX}
                                cy={spiralPath.endY}
                                r="4"
                                fill="#ffffff"
                                filter="url(#neonGlow)"
                                className="animate-pulse"
                            />
                        </>
                    )}
                </svg>
            </div>

            {/* Tactile Sliders Panel */}
            <div className="flex flex-col md:flex-row gap-6 px-4 pb-2 justify-center max-w-lg mx-auto">
                <div className="flex flex-col items-center flex-1">
                    <span className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-3 font-medium">{t.elec}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={electricField}
                        onChange={(e) => {
                            if (!hasCrashed) setElectricField(Number(e.target.value))
                        }}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                </div>

                <div className="flex flex-col items-center flex-1">
                    <span className="text-xs uppercase tracking-[0.15em] text-slate-400 mb-3 font-medium">{t.mag}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={magneticField}
                        onChange={(e) => {
                            if (!hasCrashed) setMagneticField(Number(e.target.value))
                        }}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                </div>
            </div>

            {/* Validation Feedback Status Card */}
            <div className="mt-8 h-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                        opacity: (isSuccess || errorState) ? 1 : 0,
                        scale: (isSuccess || errorState) ? 1 : 0.95
                    }}
                    className={`max-w-md mx-auto py-3 rounded-xl text-center font-bold text-sm tracking-wide border transition-colors 
                        ${isSuccess ? 'bg-green-500/20 text-green-300 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                            errorState ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-transparent'}`}
                >
                    {isSuccess ? t.success : (errorState ? t.fail : '')}
                </motion.div>
            </div>
        </div>
    )
}
