'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/useAppStore'

type Flavor = 'electron' | 'muon' | 'tau'

interface FlavorProfile {
    id: Flavor
    color: string
    label_en: string
    label_hi: string
    symbol: string
}

const FLAVORS: Record<Flavor, FlavorProfile> = {
    electron: { id: 'electron', color: '#ef4444', label_en: 'Electron', label_hi: 'इलेक्ट्रॉन', symbol: 've' },
    muon: { id: 'muon', color: '#3b82f6', label_en: 'Muon', label_hi: 'मुऑन', symbol: 'vμ' },
    tau: { id: 'tau', color: '#10b981', label_en: 'Tau', label_hi: 'ताउ', symbol: 'vτ' },
}

export function NeutrinoTrain({ lang = 'en' }: { lang?: string }) {
    const { incrementProgress } = useAppStore()

    const [isPlaying, setIsPlaying] = useState(false)
    const [distance, setDistance] = useState(0) // 0 to 1 max distance
    const [detectorPosition, setDetectorPosition] = useState(0.7) // 0.1 to 0.9 ratio

    // Wave collapse state
    const [detectedFlavor, setDetectedFlavor] = useState<Flavor | null>(null)
    const [hasFired, setHasFired] = useState(false)

    // Animation frames
    const requestRef = useRef<number | undefined>(undefined)
    const lastTimeRef = useRef<number | undefined>(undefined)

    // Translators
    const t = {
        title: lang === 'hi' ? 'द जादुई कम्यूटर' : 'The Magic Commuter',
        desc: lang === 'hi' ? 'डिटेक्टर रखें और न्यूट्रिनो फायर करें।' : 'Position the detector and fire the neutrino.',
        fire: lang === 'hi' ? 'फायर न्यूट्रिनो!' : 'Fire Neutrino!',
        reset: lang === 'hi' ? 'पुनर्स्थापित करें' : 'Reset Experiment',
        detector: lang === 'hi' ? 'खुदाई' : 'Detector',
        caught: lang === 'hi' ? 'पकड़ा गया:' : 'Measurement:',
        wave: lang === 'hi' ? 'सम्भाव्यता तरंग' : 'Probability Wave',
        success: lang === 'hi' ? 'पहचान बदल गई! न्यूट्रिनो में द्रव्यमान होता है!' : 'Identity shifted! The neutrino has mass!'
    }

    // Probability Math based on distance
    // Using simple sinusoidal interference patterns for visual demonstration
    const getProbabilities = (d: number) => {
        // L/E approximation. Let's make one full oscillation cycle over d=0 to 1
        const phase = d * Math.PI * 4

        // e -> e starts at 1, drops to ~0.3
        const pElectron = 1 - Math.sin(phase) * Math.sin(phase) * 0.7
        // e -> mu grows from 0
        const pMuon = Math.sin(phase) * Math.sin(phase) * 0.5
        // e -> tau is the remainder
        const pTau = 1 - (pElectron + pMuon)

        return { electron: pElectron, muon: pMuon, tau: pTau }
    }

    const currentProbs = getProbabilities(distance)

    // Determine visual dominant color dynamically based on probability mix
    const getMixedColor = (pEq: { electron: number, muon: number, tau: number }) => {
        // Super hacky RGB interpolation for visual "magic" shifting
        const r = (pEq.electron * 239) + (pEq.muon * 59) + (pEq.tau * 16)
        const g = (pEq.electron * 68) + (pEq.muon * 130) + (pEq.tau * 185)
        const b = (pEq.electron * 68) + (pEq.muon * 246) + (pEq.tau * 129)
        return `rgb(${r}, ${g}, ${b})`
    }

    const particleColor = detectedFlavor ? FLAVORS[detectedFlavor].color : getMixedColor(currentProbs)

    // Animation Loop
    const animate = (time: number) => {
        if (!isPlaying) return

        if (lastTimeRef.current !== undefined) {
            const deltaTime = (time - lastTimeRef.current) / 1000

            setDistance(prev => {
                const nextDist = prev + (deltaTime * 0.3) // Speed of travel

                // Collision check!
                if (nextDist >= detectorPosition && !detectedFlavor) {
                    // Collapse the wave function!
                    const roll = Math.random()
                    const probs = getProbabilities(detectorPosition)

                    let measured: Flavor = 'electron'
                    if (roll > probs.electron) measured = 'muon'
                    if (roll > probs.electron + probs.muon) measured = 'tau'

                    setDetectedFlavor(measured)
                    setIsPlaying(false)
                    incrementProgress('neutrino-train', 'no-math')
                    return detectorPosition // Stop exactly at detector
                }

                if (nextDist >= 1) {
                    setIsPlaying(false)
                    return 1
                }
                return nextDist
            })
        }

        lastTimeRef.current = time
        requestRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(animate)
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, detectorPosition])

    // Render the sine wave paths for the background chart
    const generateWavePath = (flavor: Flavor) => {
        const points = []
        for (let x = 0; x <= 100; x += 2) {
            const d = x / 100
            const probs = getProbabilities(d)
            const y = 100 - (probs[flavor] * 100) // Invert Y for SVG
            points.push(`${x}% ${y}%`)
        }
        return `M 0% ${100 - (getProbabilities(0)[flavor] * 100)}% L ${points.join(' L ')}`
    }

    return (
        <div className="glass-panel rounded-[2em] p-[2em] my-[3em] relative overflow-hidden border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8 relative z-10">
                <h3 className="text-[2em] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet mb-2">{t.title}</h3>
                <p className="text-slate-400 text-[1.1em] max-w-lg mx-auto">{t.desc}</p>
            </div>

            {/* The Simulation Track area */}
            <div className="relative w-full h-[250px] mb-8 bg-[#0a0a10] rounded-xl border border-white/5 overflow-hidden">

                {/* Background Probability Waves */}
                <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                    <path d={generateWavePath('electron')} fill="none" stroke={FLAVORS.electron.color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeDasharray="5,5" />
                    <path d={generateWavePath('muon')} fill="none" stroke={FLAVORS.muon.color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeDasharray="5,5" />
                    <path d={generateWavePath('tau')} fill="none" stroke={FLAVORS.tau.color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeDasharray="5,5" />
                </svg>

                <div className="absolute top-2 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t.wave}</div>

                {/* The Travel Track */}
                <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/10 -translate-y-1/2 rounded-full" />

                {/* Draggable Detector Position */}
                {/* We map detectorPosition (0 to 1 relative to track) to left % */}
                <div
                    className="absolute top-0 bottom-0 w-[40px] -ml-[20px] cursor-ew-resize group z-20"
                    style={{ left: `calc(2rem + ${detectorPosition * 100}%)`, display: isPlaying || hasFired ? 'none' : 'block' }}
                >
                    <div className="absolute h-full w-[2px] bg-white/20 left-1/2 -translate-x-1/2 group-hover:bg-neon-cyan transition-colors" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-slate-800 border-2 border-slate-500 rounded group-hover:border-neon-cyan flex items-center justify-center">
                        <div className="w-1 h-4 bg-slate-500 rounded-full group-hover:bg-neon-cyan" />
                    </div>
                </div>

                {/* Locked Detector Visual (when running/done) */}
                {(isPlaying || hasFired) && (
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-white/20 z-10"
                        style={{ left: `calc(2rem + ${detectorPosition * 100}%)` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-16 bg-space-950 border-2 border-white/40 border-l-transparent rounded-r-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-start overflow-hidden">
                            <div className="h-full w-2 bg-gradient-to-b from-white/10 via-white/40 to-white/10" />
                        </div>
                    </div>
                )}

                {/* The Neutrino Particle */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] z-30 flex items-center justify-center font-bold text-white text-sm"
                    style={{
                        left: `calc(2rem + ${distance * 100}%)`,
                        backgroundColor: particleColor,
                        boxShadow: `0 0 30px ${particleColor}`,
                        marginLeft: '-1rem'
                    }}
                    animate={detectedFlavor ? { scale: [1, 1.5, 1], rotate: [0, 180, 360] } : {}}
                    transition={{ duration: 0.5 }}
                >
                    {detectedFlavor ? FLAVORS[detectedFlavor].symbol : 'v'}
                </motion.div>

                {/* Flavor Probabilities Live Hud (following particle) */}
                {!detectedFlavor && hasFired && (
                    <div
                        className="absolute top-[20%] -translate-x-1/2 flex gap-2 no-select pointer-events-none"
                        style={{ left: `calc(2rem + ${distance * 100}%)` }}
                    >
                        <span className="text-red-400 font-mono text-xs font-bold drop-shadow-md bg-black/50 px-1 rounded">{(currentProbs.electron * 100).toFixed(0)}%</span>
                        <span className="text-blue-400 font-mono text-xs font-bold drop-shadow-md bg-black/50 px-1 rounded">{(currentProbs.muon * 100).toFixed(0)}%</span>
                        <span className="text-emerald-400 font-mono text-xs font-bold drop-shadow-md bg-black/50 px-1 rounded">{(currentProbs.tau * 100).toFixed(0)}%</span>
                    </div>
                )}
            </div>

            {/* Controls & Measurement Results */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between relative z-10 px-4">

                {/* Detector placement slider (fallback for pure touch/mouse tracking if needed, but slider is highly accessible) */}
                <div className="flex-1 w-full max-w-xs flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                        <span>{t.detector} L</span>
                        <span className="text-white">{detectorPosition.toFixed(2)} km</span>
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="0.95"
                        step="0.01"
                        value={detectorPosition}
                        onChange={(e) => {
                            setDetectorPosition(parseFloat(e.target.value))
                            if (hasFired) {
                                setDistance(0)
                                setHasFired(false)
                                setDetectedFlavor(null)
                            }
                        }}
                        disabled={isPlaying}
                        className="w-full appearance-none bg-slate-800 h-2 rounded-full outline-none disabled:opacity-50"
                    />
                </div>

                {/* Measurement Box */}
                <div className="flex-1 w-full flex justify-center">
                    <div className={`px-6 py-3 rounded-xl border-2 transition-all min-w-[200px] text-center ${detectedFlavor ? 'bg-black/40 border-slate-500' : 'bg-transparent border-dashed border-slate-700'}`}>
                        {detectedFlavor ? (
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">{t.caught}</span>
                                <span className="text-xl font-bold" style={{ color: FLAVORS[detectedFlavor].color }}>
                                    {lang === 'hi' ? FLAVORS[detectedFlavor].label_hi : FLAVORS[detectedFlavor].label_en} Neutrino
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm text-slate-500 italic font-mono uppercase tracking-widest flex items-center justify-center h-full">System Ready</span>
                        )}
                    </div>
                </div>

                {/* Primary Action */}
                <div className="flex-1 w-full flex justify-end">
                    {!hasFired ? (
                        <button
                            onClick={() => {
                                setHasFired(true)
                                setIsPlaying(true)
                                lastTimeRef.current = undefined
                            }}
                            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-violet rounded-full font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105 transition-all text-sm uppercase tracking-widest whitespace-nowrap"
                        >
                            {t.fire}
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setDistance(0)
                                setHasFired(false)
                                setDetectedFlavor(null)
                                setIsPlaying(false)
                            }}
                            className="w-full md:w-auto px-8 py-4 bg-white/10 rounded-full font-bold text-white border border-white/20 hover:bg-white/20 transition-all text-sm uppercase tracking-widest"
                        >
                            {t.reset}
                        </button>
                    )}
                </div>
            </div>

            {/* Educational Overlay if a shift was detected */}
            {detectedFlavor && detectedFlavor !== 'electron' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500/20 text-emerald-300 border border-emerald-500 px-6 py-2 rounded-full text-sm font-bold tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] z-50 pointer-events-none whitespace-nowrap"
                >
                    ✨ {t.success}
                </motion.div>
            )}

        </div>
    )
}
