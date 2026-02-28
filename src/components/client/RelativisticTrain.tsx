'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export function RelativisticTrain({ lang = 'en' }: { lang?: string }) {
    const [velocityC, setVelocityC] = useState(0) // 0 to 0.99
    const [platformTime, setPlatformTime] = useState(0)
    const [trainTime, setTrainTime] = useState(0)
    const [perspective, setPerspective] = useState<'platform' | 'train'>('platform')
    const [isSuccess, setIsSuccess] = useState(false)

    // Tick Engine
    useEffect(() => {
        let lastTime = performance.now()
        let rafId: number

        const tick = (now: number) => {
            const delta = (now - lastTime) / 1000
            lastTime = now

            // Time always marches normally for the "stationary" platform observer
            setPlatformTime(prev => prev + delta)

            // Calculate Lorentz Factor Gamma for the moving train
            // gamma = 1 / sqrt(1 - v^2/c^2). Here velocityC is already v/c.
            const v2c2 = velocityC * velocityC
            const gamma = 1 / Math.sqrt(1 - v2c2)

            // For the observer on the platform, time on the train slows down (t_train = t_platform / gamma)
            // Wait, proper time tau = t / gamma. So yes, train clock ticks slower.
            setTrainTime(prev => prev + (delta / gamma))

            // Win Condition: High velocity forces significant time dilation difference
            if (velocityC > 0.90 && !isSuccess) {
                setIsSuccess(true)
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.8 },
                    colors: ['#FCD34D', '#10B981']
                })
            }

            rafId = requestAnimationFrame(tick)
        }

        rafId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafId)
    }, [velocityC, isSuccess])

    const t = {
        title: lang === 'hi' ? 'सापेक्षिक रेलवे' : 'The Relativistic Railway',
        throttle: lang === 'hi' ? 'ट्रेन थ्रॉटल (Train Throttle)' : 'Train Throttle',
        viewPlat: lang === 'hi' ? 'प्लेटफ़ॉर्म से देखें' : 'View from Platform',
        viewTrain: lang === 'hi' ? 'ट्रेन से देखें' : 'View from Train',
        platStat: lang === 'hi' ? 'स्थिर प्लेटफ़ॉर्म घड़ी' : 'Stationary Platform Clock',
        trainClock: lang === 'hi' ? 'ट्रेन की घड़ी' : 'Train Clock',
        success: lang === 'hi' ? 'समय फैलाव सिद्ध हुआ! (Twin Paradox)' : 'Time Dilation Proven! (Twin Paradox)'
    }

    // Length contraction logic depending on perspective.
    const gammaLength = Math.sqrt(1 - (velocityC * velocityC))

    // If viewing from platform: train looks squished. Platform looks 1.0.
    // If viewing from train: platform looks squished moving backwards, train looks 1.0.
    const trainScaleX = perspective === 'platform' ? Math.max(gammaLength, 0.15) : 1
    const platformScaleX = perspective === 'train' ? Math.max(gammaLength, 0.15) : 1

    // Simulation animation speeds
    // If viewing from platform, train moves Right.
    // If viewing from train, platform moves Left.
    const speedVisualizer = velocityC * 10

    return (
        <div className="w-full max-w-3xl mx-auto my-12 bg-gray-900/40 p-1em rounded-3xl border border-white/5 backdrop-blur-xl group">
            <h3 className="text-xl font-display font-medium text-white/80 mb-6 px-1em text-center">
                {t.title}
            </h3>

            {/* Split Screen Concept */}
            <div className="flex flex-col gap-2 mb-8 px-4">

                {/* Visualizer Frame */}
                <div className="relative w-full h-[250px] bg-black/60 rounded-2xl border-4 border-slate-700 shadow-inner overflow-hidden flex flex-col justify-end">

                    {/* The Background/Platform Environment */}
                    <div className="absolute inset-0 z-0 opacity-50 flex items-end">
                        <motion.div
                            className="h-full w-[300%] flex items-end pb-12 gap-12 pl-12"
                            style={{ originX: 0.5 }}
                            animate={{
                                x: perspective === 'train' ? ['0%', '-50%'] : '0%', // Only moves if viewed from train
                                scaleX: platformScaleX
                            }}
                            transition={{
                                duration: Math.max(2 / (speedVisualizer || 0.1), 0.1),
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            {/* Pillars representing the station */}
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="w-8 h-32 bg-slate-800 border-x border-slate-700 relative flex-shrink-0">
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-600/50" />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Left side fixed UI: The Observer on the Platform (only visible if platform view) */}
                    <AnimatePresence>
                        {perspective === 'platform' && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute left-8 bottom-4 z-20 flex flex-col items-center"
                            >
                                <div className="text-[10px] bg-black/80 px-2 py-1 rounded text-cyan-400 font-mono mb-2 whitespace-nowrap shadow-md border border-cyan-800">
                                    {t.platStat}: {platformTime.toFixed(1)}s
                                </div>
                                {/* Stick figure observer */}
                                <div className="w-4 h-4 bg-cyan-500 rounded-full mb-1" />
                                <div className="w-2 h-8 bg-cyan-500 rounded-sm" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* The Train */}
                    <motion.div
                        className="absolute bottom-4 z-10 flex flex-col items-center"
                        style={{ originX: 0.5 }}
                        animate={{
                            x: perspective === 'platform' ? ['-20%', '150%'] : '40%', // Train zooms across if platform view. Fixed in middle if train view.
                            scaleX: trainScaleX
                        }}
                        transition={{
                            duration: Math.max(2 / (speedVisualizer || 0.1), 0.1),
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {/* Train Clock UI attaches to the train roof */}
                        <div className="text-[10px] bg-black/80 px-2 py-1 rounded text-amber-400 font-mono mb-2 whitespace-nowrap shadow-md border border-amber-800 scale-x-100"
                            style={{ transform: `scaleX(${1 / trainScaleX})` }} // Counter-scale text so it's readable, ignoring parent squish
                        >
                            {t.trainClock}: {trainTime.toFixed(1)}s
                        </div>
                        {/* The Train Body */}
                        <div className="w-[300px] h-16 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg shadow-xl border border-amber-400 flex items-center px-4 gap-4 overflow-hidden">
                            {/* Windows */}
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-12 h-8 bg-black/50 rounded-md border border-black/80 flex items-end justify-center">
                                    {/* Observer inside the middle window */}
                                    {i === 2 && (
                                        <div className="w-3 h-5 bg-amber-200 rounded-t-full opacity-80" />
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Wheels */}
                        <div className="flex gap-16 translate-y-[-4px]">
                            <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-500" />
                            <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-500" />
                        </div>
                    </motion.div>

                    {/* Perspective Label overlay */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white/50 text-xs px-2 py-1 rounded backdrop-blur border border-white/5 font-mono z-30 tracking-widest uppercase">
                        {perspective === 'platform' ? 'Platform Reference Frame' : 'Train Reference Frame'}
                    </div>
                </div>

                {/* Controls Area */}
                <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-6">

                    {/* Perspective Toggles */}
                    <div className="flex gap-2 p-1 bg-slate-900 rounded-xl w-fit mx-auto ring-1 ring-white/5 shadow-inner">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${perspective === 'platform' ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-500 hover:text-white'}`}
                            onClick={() => { setPerspective('platform'); setPlatformTime(0); setTrainTime(0); }}
                        >
                            {t.viewPlat}
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${perspective === 'train' ? 'bg-amber-600/20 text-amber-400' : 'text-slate-500 hover:text-white'}`}
                            onClick={() => { setPerspective('train'); setPlatformTime(0); setTrainTime(0); }}
                        >
                            {t.viewTrain}
                        </button>
                    </div>

                    {/* Velocity Slider */}
                    <div className="w-full flex items-center gap-4">
                        <span className="text-xs font-mono text-slate-400 whitespace-nowrap">{t.throttle}</span>
                        <input
                            type="range"
                            min="0"
                            max="99"
                            value={velocityC * 100}
                            onChange={(e) => setVelocityC(Number(e.target.value) / 100)}
                            className="flex-1 accent-white hover:accent-amber-400 transition-all"
                        />
                        <span className="text-sm font-mono font-bold text-white w-12 text-right">{velocityC.toFixed(2)}c</span>
                    </div>
                </div>

            </div>

            {/* Success States */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-4 p-4 bg-green-500/10 text-green-400 rounded-xl text-center font-bold text-sm tracking-wide ring-1 ring-green-500/30"
                    >
                        {t.success}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
