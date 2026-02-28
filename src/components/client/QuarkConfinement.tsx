'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useAppStore } from '@/lib/useAppStore'

export function QuarkConfinement({ lang = 'en' }: { lang?: string }) {
    const { incrementProgress } = useAppStore()

    // Core physics state
    const trackRef = useRef<HTMLDivElement>(null)
    const [trackWidth, setTrackWidth] = useState(0)

    // x is the dragged distance of the antiquark (right particle)
    const x = useMotionValue(0)

    // React state for triggers
    const [hasSnapped, setHasSnapped] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    // We'll set the snap threshold to 80% of the track width
    const thresholdX = trackWidth * 0.8

    // Localization
    const t = {
        title: lang === 'hi' ? 'द अनब्रेकेबल स्प्रिंग' : 'The Unbreakable Spring',
        desc: lang === 'hi' ? 'एंटीक्वार्क को दूर खींचकर मजबूत बल को स्ट्रेच करें।' : 'Stretch the Strong Force by dragging the Antiquark away.',
        energy: lang === 'hi' ? 'ऊर्जा संचय' : 'Energy Accumulation',
        snap_warn: lang === 'hi' ? 'महत्वपूर्ण तनाव!' : 'CRITICAL TENSION!',
        q_label: lang === 'hi' ? 'क्वार्क' : 'Quark',
        aq_label: lang === 'hi' ? 'एंटीक्वार्क' : 'Antiquark',
        success_title: lang === 'hi' ? 'E = mc² प्रमाणित!' : 'E = mc² Verified!',
        success_desc: lang === 'hi' ? 'ग्लूऑन ऊर्जा द्रव्यमान में परिवर्तित होकर एक नया मेसन जोड़ा बना!' : 'The gluon energy converted into mass, creating a new Meson pair!',
        reset: lang === 'hi' ? 'पुनर्स्थापित करें' : 'Reset Experiment'
    }

    // Effect to mount dimensions
    useEffect(() => {
        if (trackRef.current) {
            setTrackWidth(trackRef.current.offsetWidth)
        }

        const handleResize = () => {
            if (trackRef.current) setTrackWidth(trackRef.current.offsetWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Physics Handlers for the X Drag value
    // Energy grows exponentially mapping [0, thresholdX] to [0, 100]
    const energyPercent = useTransform(x, [0, thresholdX], [0, 100])

    // The "Gluon Tube" visually scales and changes color as it stretches
    // V(r) ~ kr, so tension builds linearly, but visually we shift color
    const tubeWidth = useTransform(x, (latest) => Math.max(0, latest))
    const tubeOpacity = useTransform(x, [0, thresholdX], [0.3, 1])
    const tubeColor = useTransform(x, [0, thresholdX * 0.5, thresholdX], ['#ec4899', '#a855f7', '#3b82f6'])

    // Glow effect (mass energy equivalence build-up)
    const glowIntensity = useTransform(x, [0, thresholdX], [0, 50])
    const tubeGlowStyle = useTransform(glowIntensity, g => `0 0 ${g}px ${g / 2}px rgba(168, 85, 247, 0.5)`)
    const energyLabelStyle = useTransform(energyPercent, p => `${p.toFixed(1)} GeV`)
    const energyLabelColor = useTransform(energyPercent, [0, 80, 100], ['#94a3b8', '#fbbf24', '#ef4444'])
    const meterWidth = useTransform(energyPercent, p => `${p}%`)
    const meterColor = useTransform(energyPercent, [0, 50, 80, 100], ['#3b82f6', '#8b5cf6', '#fbbf24', '#ef4444'])
    const warningOpacity = useTransform(energyPercent, [60, 80], [0, 1])

    // Monitor the drag to snap it
    useEffect(() => {
        const unsubscribe = x.on('change', (latestX) => {
            if (!hasSnapped && trackWidth > 0 && latestX >= thresholdX) {
                // E=mc^2 Moment!
                setHasSnapped(true)
                incrementProgress('quark-confinement', 'no-math')
                // We keep the value at threshold visually, React state will handle the UI swap
            }
        })
        return () => unsubscribe()
    }, [x, hasSnapped, thresholdX, trackWidth, incrementProgress])

    return (
        <div className="glass-panel text-white rounded-[2em] p-[2em] my-[3em] relative overflow-hidden ring-1 ring-white/10">
            {/* Header */}
            <div className="text-center mb-[3em] relative z-10">
                <h3 className="text-[2em] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-2">{t.title}</h3>
                <p className="text-slate-400 text-[1.1em]">{t.desc}</p>
            </div>

            {/* Main Interactive Stage */}
            <div
                ref={trackRef}
                className="relative w-full h-[200px] bg-[#050810] rounded-2xl border border-white/5 flex items-center mb-8"
                style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)' }}
            >
                {/* The Initial Meson State (Before Snap) */}
                {!hasSnapped ? (
                    <div className="absolute left-8 right-[120px] h-20 top-1/2 -translate-y-1/2 flex items-center">

                        {/* Static Left Quark */}
                        <div className="absolute left-0 w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(236,72,153,0.5)] z-20">
                            u
                            <span className="absolute -top-6 text-xs text-pink-300 tracking-widest uppercase">{t.q_label}</span>
                        </div>

                        {/* The Dynamic Gluon Flux Tube */}
                        <motion.div
                            className="absolute left-[32px] h-[6px] origin-left rounded-full z-10"
                            style={{
                                width: tubeWidth,
                                backgroundColor: tubeColor,
                                opacity: tubeOpacity,
                                boxShadow: tubeGlowStyle
                            }}
                        />

                        {/* Draggable Right Antiquark */}
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: trackWidth - 160 }}
                            dragElastic={0} // Stiff elastic to represent the spring tension
                            dragMomentum={false}
                            style={{ x }}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={() => {
                                setIsDragging(false)
                                // If released before snap, it springs back exactly like a rubber band!
                                if (!hasSnapped) {
                                    x.set(0) // Framer's built in smooth reset would use animate, but set is instant. Let's use animate.
                                }
                            }}
                            animate={!isDragging && !hasSnapped ? { x: 0 } : undefined}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute left-[20px] w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] z-30 cursor-grab active:cursor-grabbing border-2 border-white/20"
                        >
                            ū
                            <span className="absolute -bottom-6 text-xs text-blue-300 tracking-widest uppercase">{t.aq_label}</span>

                            {/* Visual Hint to drag */}
                            {!isDragging && x.get() === 0 && (
                                <motion.div
                                    className="absolute -right-8 w-6 h-6 border-t-2 border-r-2 border-white/50 rotate-45"
                                    animate={{ x: [0, 10, 0], opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                />
                            )}
                        </motion.div>
                    </div>
                ) : (
                    /* The Snapped State (Two Mesons) */
                    <div className="absolute inset-0 flex items-center px-8 w-full">
                        {/* Dramatic E=mc^2 Flash Overlay that fades out */}
                        <motion.div
                            className="absolute inset-0 bg-white z-50 mix-blend-overlay"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />

                        <div className="w-full flex justify-between items-center relative z-40">
                            {/* Original Quark paired with NEW Antiquark */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="flex items-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(236,72,153,0.5)] z-20">u</div>
                                <div className="w-8 h-[6px] bg-emerald-500/50 -mx-1 z-10" />
                                <div className="w-16 h-16 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center font-bold text-xl shadow-[0_0_30px_rgba(16,185,129,0.8)] z-20">
                                    ū <span className="absolute -top-8 text-xs text-emerald-400 font-bold tracking-widest w-[100px] text-center">NEW MASS</span>
                                </div>
                            </motion.div>

                            {/* NEW Quark paired with Original Antiquark */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="flex items-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center font-bold text-xl shadow-[0_0_30px_rgba(16,185,129,0.8)] z-20">
                                    u <span className="absolute -top-8 text-xs text-emerald-400 font-bold tracking-widest w-[100px] text-center">NEW MASS</span>
                                </div>
                                <div className="w-8 h-[6px] bg-blue-500/50 -mx-1 z-10" />
                                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] z-20">ū</div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>

            {/* Energy Meter UI */}
            <div className="flex flex-col gap-2 relative z-10 px-4">
                <div className="flex justify-between text-sm font-bold tracking-widest uppercase">
                    <span className="text-slate-400">{t.energy}</span>
                    {/* Render the math output live */}
                    <motion.span
                        className="font-mono"
                        style={{ color: energyLabelColor }}
                    >
                        {energyLabelStyle}
                    </motion.span>
                </div>

                {/* Meter Bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10 relative">
                    <motion.div
                        className="absolute left-0 top-0 bottom-0 rounded-full"
                        style={{
                            width: meterWidth,
                            backgroundColor: meterColor
                        }}
                    />
                    {/* Threshold Marker */}
                    <div className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10" style={{ left: '80%' }} />
                </div>

                {/* Dynamic Warning Text */}
                <div className="h-6 mt-1 text-center">
                    <motion.div
                        style={{ opacity: warningOpacity }}
                        className="text-xs font-bold text-red-500 tracking-widest uppercase animate-pulse"
                    >
                        ⚠ {t.snap_warn}
                    </motion.div>
                </div>
            </div>

            {/* Success Overlay */}
            {hasSnapped && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 bg-space-950/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 rounded-[2em] border border-white/10 text-center"
                >
                    <div className="text-6xl mb-6">💥</div>
                    <h3 className="text-3xl font-display font-bold text-emerald-400 mb-2">{t.success_title}</h3>
                    <p className="text-slate-300 text-lg mb-8 max-w-md">{t.success_desc}</p>

                    <button
                        onClick={() => {
                            setHasSnapped(false)
                            x.set(0)
                        }}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold uppercase tracking-widest transition-all"
                    >
                        {t.reset}
                    </button>
                </motion.div>
            )}
        </div>
    )
}
