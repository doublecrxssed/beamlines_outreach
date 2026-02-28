'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useAppStore } from '@/lib/useAppStore'
import confetti from 'canvas-confetti'

export function UnificationEpoch({ lang = 'en' }: { lang?: string }) {
    const { incrementProgress } = useAppStore()

    // Core simulation state
    const trackRef = useRef<HTMLDivElement>(null)
    const [trackWidth, setTrackWidth] = useState(0)

    // Slider value x represents energy level (log scale roughly from 10^2 to 10^16 GeV)
    const x = useMotionValue(0)

    // We'll map the UI slider distance to an internal 0 to 1 value for calculations
    const [sliderPercent, setSliderPercent] = useState(0)
    const [hasUnified, setHasUnified] = useState(false)

    // Localization
    const t = {
        title: lang === 'hi' ? 'एकीकरण युग' : 'The Unification Epoch',
        desc: lang === 'hi' ? 'समय को बिग बैंग की तरफ पीछे धकेलें।' : 'Rewind time towards the Big Bang.',
        energy: lang === 'hi' ? 'ब्रह्मांडीय ऊर्जा:' : 'Cosmic Energy:',
        temp: lang === 'hi' ? 'तापमान:' : 'Temperature:',
        strong: lang === 'hi' ? 'मजबूत बल' : 'Strong Force',
        weak: lang === 'hi' ? 'कमजोर बल' : 'Weak Force',
        em: lang === 'hi' ? 'विद्युत चुंबकत्व' : 'Electromagnetism',
        success_title: lang === 'hi' ? 'भव्य एकीकरण (Grand Unification)' : 'Grand Unification',
        success_desc: lang === 'hi' ? 'बधाई हो! आपने ब्रह्मांड के मूलभूत बलों को सफलतापूर्वक एकजुट कर लिया है। आपने भौतिकी पाठ्यक्रम पूरा कर लिया है!' : 'Congratulations! You have successfully unified the fundamental forces of the universe. You have completed the physics curriculum!',
        gut_scale: lang === 'hi' ? 'GUT पैमाना' : 'GUT Scale'
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

    // Monitor the drag to track percentage and trigger unification
    useEffect(() => {
        const unsubscribe = x.on('change', (latestX) => {
            if (trackWidth > 0) {
                // Determine percentage (0 to 1)
                const percent = Math.max(0, Math.min(1, latestX / trackWidth))
                setSliderPercent(percent)

                // Trigger unification at > 99%
                if (percent > 0.99 && !hasUnified) {
                    setHasUnified(true)
                    incrementProgress('grand-unified-theory', 'no-math')

                    // Grand Finale Confetti!
                    const duration = 3000
                    const end = Date.now() + duration

                    const frame = () => {
                        confetti({
                            particleCount: 5,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: ['#fff', '#3b82f6', '#ec4899', '#8b5cf6']
                        })
                        confetti({
                            particleCount: 5,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 },
                            colors: ['#fff', '#3b82f6', '#ec4899', '#8b5cf6']
                        })
                        if (Date.now() < end) requestAnimationFrame(frame)
                    }
                    frame()
                }
            }
        })
        return () => unsubscribe()
    }, [x, trackWidth, hasUnified, incrementProgress])

    // Math Models for Running Coupling Constants (Visual approximations)
    // We map sliderPercent (0 to 1) to Energy Log_10(E) from 2 to 16
    // E&M (U(1)) gets stronger (goes up)
    // Weak (SU(2)) stays relatively flat then dips slightly
    // Strong (SU(3)) starts high and drops dramatically

    // Inverse Coupling Strength (1/alpha) on Y axis (0 to 100)
    // Actually, let's just plot Coupling Strength (alpha) directly for intuition.
    // E&M goes UP, Strong goes DOWN.
    const emVal = 20 + (sliderPercent * 60) // Starts low, ends at 80
    const weakVal = 40 + (sliderPercent * 40) // Starts mid, ends at 80
    const strongVal = 100 - (sliderPercent * 20) // Starts max, ends at 80

    // Dynamic Background Color (Heating up to the Big Bang)
    // Space Black -> Deep Red -> Blinding White
    let bgPulse = `rgba(11, 15, 25, 1)` // default background
    if (sliderPercent > 0) {
        // Linearly interpolate color
        const r = Math.floor(11 + (sliderPercent * 244)) // 11 -> 255
        const g = Math.floor(15 + (sliderPercent * 240)) // 15 -> 255
        const b = Math.floor(25 + (sliderPercent * 230)) // 25 -> 255
        bgPulse = `rgb(${r}, ${g}, ${b})`
    }

    // Render the Graph SVG Paths based on current slider percent
    // We'll draw from x=0 to x=sliderPercent
    const generatePath = (startVal: number, endVal: number) => {
        // Maps 0-1 percent to X pixel coords 0-800
        const scaleX = 800
        const scaleY = 400 // Canvas height

        // Invert Y for SVG coords (100 = top, 0 = bottom)
        const sY = scaleY - (startVal / 100 * scaleY)
        const eY = scaleY - (endVal / 100 * scaleY)
        const eX = sliderPercent * scaleX

        return `M 0 ${sY} L ${eX} ${eY}`
    }

    return (
        <div className="glass-panel rounded-[2em] p-[2em] my-[3em] relative overflow-hidden ring-1 ring-white/10 transition-colors duration-200" style={{ backgroundColor: sliderPercent > 0.8 ? 'rgba(255,255,255,0.1)' : undefined }}>

            {/* Ambient Background that heats up */}
            <div
                className="absolute inset-0 z-0 transition-colors duration-100 ease-linear opacity-20"
                style={{ backgroundColor: bgPulse }}
            />

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
                <h3 className="text-[2em] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet mb-2">{t.title}</h3>
                <p className="text-slate-400 text-[1.1em]">{t.desc}</p>
            </div>

            {/* The Graph / Simulation Stage */}
            <div className="relative w-full h-[300px] bg-[#050810] rounded-2xl border border-white/5 mb-8 overflow-hidden z-10" style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)' }}>

                {/* Axes and Grid */}
                <div className="absolute inset-x-8 inset-y-8 border-l-2 border-b-2 border-white/20">
                    <span className="absolute -left-6 top-0 text-xs text-slate-500 font-bold -rotate-90 origin-left whitespace-nowrap">Coupling Strength (α)</span>
                    <span className="absolute right-0 -bottom-6 text-xs text-slate-500 font-bold">Energy ($10^x$ GeV)</span>

                    {/* GUT Target Marker */}
                    <div className="absolute right-0 top-0 bottom-0 w-px border-l-2 border-dashed border-yellow-500/50">
                        <span className="absolute -top-6 -right-8 text-xs font-bold text-yellow-500 bg-space-950 px-2 rounded-full border border-yellow-500/30">{t.gut_scale}</span>
                    </div>

                    {/* SVG Drawing Layer for the Running Coupling Lines */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="none">

                        {/* Ghost Paths (showing the full journey so user knows where they are going) */}
                        <path d="M 0 320 L 800 80" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" opacity="0.2" vectorEffect="non-scaling-stroke" />
                        <path d="M 0 240 L 800 80" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" opacity="0.2" vectorEffect="non-scaling-stroke" />
                        <path d="M 0 0 L 800 80" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="5,5" opacity="0.2" vectorEffect="non-scaling-stroke" />

                        {/* Solid Paths (drawn up to sliderPercent) */}
                        <path d={generatePath(20, emVal)} fill="none" stroke="#3b82f6" strokeWidth="4" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" vectorEffect="non-scaling-stroke" />
                        <path d={generatePath(40, weakVal)} fill="none" stroke="#8b5cf6" strokeWidth="4" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" vectorEffect="non-scaling-stroke" />
                        <path d={generatePath(100, strongVal)} fill="none" stroke="#ec4899" strokeWidth="4" className="drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" vectorEffect="non-scaling-stroke" />

                        {/* Live Particles at the ends of the lines */}
                        <circle cx={sliderPercent * 800} cy={400 - (emVal / 100 * 400)} r="6" fill="#3b82f6" className="drop-shadow-[0_0_10px_rgba(59,130,246,1)]" />
                        <circle cx={sliderPercent * 800} cy={400 - (weakVal / 100 * 400)} r="6" fill="#8b5cf6" className="drop-shadow-[0_0_10px_rgba(139,92,246,1)]" />
                        <circle cx={sliderPercent * 800} cy={400 - (strongVal / 100 * 400)} r="6" fill="#ec4899" className="drop-shadow-[0_0_10px_rgba(236,72,153,1)]" />
                    </svg>
                </div>

                {/* Labels that follow the particles */}
                <div
                    className="absolute z-20 pointer-events-none transition-all duration-75"
                    style={{ left: `calc(2rem + ${sliderPercent * 100}% - 4rem)`, top: `calc(2rem + ${100 - emVal}% - 1.5rem)` }}
                >
                    <span className="text-xs font-bold text-blue-400 bg-space-950/80 px-2 rounded-full border border-blue-500/30 whitespace-nowrap hidden sm:block">{t.em}</span>
                </div>
                <div
                    className="absolute z-20 pointer-events-none transition-all duration-75"
                    style={{ left: `calc(2rem + ${sliderPercent * 100}% - 2.5rem)`, top: `calc(2rem + ${100 - weakVal}% - 1.5rem)` }}
                >
                    <span className="text-xs font-bold text-violet-400 bg-space-950/80 px-2 rounded-full border border-violet-500/30 whitespace-nowrap hidden sm:block">{t.weak}</span>
                </div>
                <div
                    className="absolute z-20 pointer-events-none transition-all duration-75"
                    style={{ left: `calc(2rem + ${sliderPercent * 100}% - 3rem)`, top: `calc(2rem + ${100 - strongVal}% - 1.5rem)` }}
                >
                    <span className="text-xs font-bold text-pink-400 bg-space-950/80 px-2 rounded-full border border-pink-500/30 whitespace-nowrap hidden sm:block">{t.strong}</span>
                </div>
            </div>

            {/* Live Data HUD */}
            <div className="flex justify-between items-center mb-6 px-4 relative z-10">
                <div className="text-left">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.energy}</div>
                    <div className="text-2xl font-mono text-neon-cyan font-bold transition-all" style={{ textShadow: sliderPercent > 0.8 ? '0 0 20px rgba(6,182,212,0.8)' : undefined }}>
                        10<sup className="text-sm">{Math.floor(2 + (sliderPercent * 14))}</sup> GeV
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.temp}</div>
                    <div className="text-2xl font-mono text-amber-500 font-bold transition-all" style={{ textShadow: sliderPercent > 0.8 ? '0 0 20px rgba(245,158,11,0.8)' : undefined }}>
                        10<sup className="text-sm">{Math.floor(15 + (sliderPercent * 14))}</sup> K
                    </div>
                </div>
            </div>

            {/* Time Slider Controls */}
            <div className="relative w-full h-[60px] bg-slate-800/50 rounded-full border border-white/10 flex items-center px-2 z-10 box-border" ref={trackRef}>
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: trackWidth ? trackWidth - 56 : 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    style={{ x }}
                    className="w-[44px] h-[44px] bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center cursor-grab active:cursor-grabbing border-4 border-slate-900 z-20 relative"
                >
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-slate-300 rounded-full" />
                        <div className="w-1 h-3 bg-slate-300 rounded-full" />
                    </div>
                    {sliderPercent === 0 && (
                        <div className="absolute -top-8 text-xs font-bold text-white bg-blue-500 px-3 py-1 rounded-full animate-bounce whitespace-nowrap shadow-lg">
                            Rewind Time
                        </div>
                    )}
                </motion.div>

                {/* Track progress fill */}
                <div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-pink-500/50 rounded-full pointer-events-none transition-all duration-75"
                    style={{ width: `calc(${sliderPercent * 100}% + 28px)` }}
                />
            </div>

            {/* The Big Bang Success State (Only mounts on unification) */}
            {hasUnified && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-white to-neon-violet opacity-50 blur-xl mix-blend-multiply" />

                    <h3 className="text-5xl md:text-6xl font-display font-bold text-space-950 mb-4 tracking-tighter mix-blend-hard-light relative z-10">{t.success_title}</h3>
                    <p className="text-slate-800 text-xl md:text-2xl max-w-2xl font-medium relative z-10 leading-relaxed mb-12">
                        {t.success_desc}
                    </p>

                    <button
                        onClick={() => {
                            setHasUnified(false)
                            x.set(0)
                        }}
                        className="px-10 py-5 bg-space-950 hover:bg-slate-900 border border-slate-800 rounded-full font-bold uppercase tracking-widest transition-all text-white shadow-2xl relative z-10"
                    >
                        Restart Universe
                    </button>

                    {/* Floating background physics runes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 text-space-950 text-4xl font-mono flex flex-wrap gap-8 p-12 justify-center items-center mix-blend-overlay">
                        <span>{`$U(1)$`}</span><span>{`$SU(2)$`}</span><span>{`$SU(3)$`}</span><span>{`$E=mc^2$`}</span>
                        <span>{`$\\alpha_{GUT}$`}</span><span>{`$10^{16}$ GeV`}</span><span>{`$v_e$`}</span><span>{`$\\gamma$`}</span>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
