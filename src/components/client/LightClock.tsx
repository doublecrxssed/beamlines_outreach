'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export function LightClock({ lang = 'en' }: { lang?: string }) {
    const [velocityPercentage, setVelocityPercentage] = useState(0) // 0 to 99
    const [clockA, setClockA] = useState(0)
    const [clockB, setClockB] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)

    // Physics Constants
    const c = 100 // Abstract speed limit

    // Time Dilation Tick Engine
    useEffect(() => {
        if (isSuccess) return;

        let lastTime = performance.now()
        let rafId: number

        const tick = (now: number) => {
            const delta = (now - lastTime) / 1000 // elapsed seconds since last frame
            lastTime = now

            // Clock A is stationary (v = 0), so it ticks at 1.0x normal time
            setClockA(prev => prev + delta)

            // Clock B is moving. Calculate Lorentz Factor (Gamma)
            const v = (velocityPercentage / 100) * c
            const gamma = 1 / Math.sqrt(1 - (v * v) / (c * c))

            // Time dilates (slows down) for the moving clock
            const dilatedDelta = delta / gamma
            setClockB(prev => prev + dilatedDelta)

            // Success Condition: If the player achieves high enough velocity difference
            if (velocityPercentage > 90 && !isSuccess) {
                setIsSuccess(true)
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#FCD34D', '#FFFFFF']
                })
            }

            rafId = requestAnimationFrame(tick)
        }

        rafId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafId)
    }, [velocityPercentage, isSuccess])


    const t = {
        title: lang === 'hi' ? 'द लाइट क्लॉक' : 'The Light Clock',
        stat: lang === 'hi' ? 'स्थिर घड़ी (A)' : 'Stationary Clock (A)',
        move: lang === 'hi' ? 'रॉकेट घड़ी (B)' : 'Rocket Clock (B)',
        vel: lang === 'hi' ? 'रॉकेट का वेग' : 'Rocket Velocity',
        success: lang === 'hi' ? 'समय फैलाव देखा गया!' : 'Time Dilation Observed!'
    }

    // Visual calculations based on velocity
    const vC = velocityPercentage / 100
    // As v approaches c, length contracts in the direction of motion (X-axis)
    const lengthContraction = Math.sqrt(1 - (vC * vC))

    // To represent the bouncing photon, we use a CSS animation whose duration
    // is intrinsically linked to the Lorentz factor we calculated above.
    // Base bounce takes 1s.
    const gammaVisual = 1 / Math.sqrt(1 - (vC * vC))
    const bounceDurationA = 1
    const bounceDurationB = 1 * gammaVisual


    return (
        <div className="w-full max-w-2xl mx-auto my-12 bg-gray-900/40 p-1em rounded-3xl border border-white/5 backdrop-blur-xl group">
            <h3 className="text-xl font-display font-medium text-white/80 mb-6 px-1em text-center">
                {t.title}
            </h3>

            {/* The Environment */}
            <div className="relative w-full h-64 mb-8 bg-black/60 rounded-2xl border-4 border-slate-700 shadow-inner flex flex-col justify-evenly px-4 overflow-hidden">

                {/* Track A: Stationary Clock */}
                <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 relative">
                    <div className="text-xs text-slate-400 font-mono absolute top-0 left-0">Clock A (v = 0c)</div>
                    <div className="text-2xl font-mono text-cyan-400 font-bold ml-auto z-10">{clockA.toFixed(1)}s</div>

                    {/* The Stationary Clock UI */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-2 h-16 w-8 border-y-4 border-slate-500">
                        {/* Bouncing Photon A */}
                        <motion.div
                            className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9] mx-auto"
                            animate={{ y: [0, 48, 0] }}
                            transition={{ duration: bounceDurationA, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>

                {/* Track B: Moving Clock (Rocket) */}
                <div className="w-full flex items-center justify-between relative pt-4">
                    <div className="text-xs text-slate-400 font-mono absolute top-4 left-0">Clock B (v = {vC.toFixed(2)}c)</div>
                    <div className="text-2xl font-mono text-amber-400 font-bold ml-auto z-10">{clockB.toFixed(1)}s</div>

                    {/* The Moving Clock UI (Stretches due to length contraction relative to stationary obs) */}
                    {/* Actually length contracts, so scaleX decreases */}
                    <motion.div
                        className="absolute left-[10%] top-6 h-16 w-16 bg-slate-800 rounded-lg border-2 border-slate-600 flex justify-center overflow-hidden z-0"
                        style={{ originX: 0.5 }}
                        animate={{
                            x: ['0%', '400%', '0%'], // Rocket flies back and forth to keep things on screen
                            scaleX: Math.max(lengthContraction, 0.2) // Don't let it shrink to exactly 0 to keep UI visible
                        }}
                        transition={{
                            duration: 4 * bounceDurationB, // Takes longer to cross screen as time dilates
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <div className="h-full w-8 border-y-4 border-slate-400">
                            {/* Bouncing Photon B */}
                            {/* We don't animate X inside the cart, the cart moves. The photon just bounces Y, but because the cart moves it traces a diagonal in world space */}
                            <motion.div
                                className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fcd34d] mx-auto relative z-20"
                                animate={{ y: [0, 48, 0] }}
                                transition={{ duration: bounceDurationB, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Slider Controls */}
            <div className="px-1em mb-4">
                <div className="flex justify-between text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
                    <span>{t.vel}: </span>
                    <span className="text-white">{vC.toFixed(2)}c</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="99"
                    value={velocityPercentage}
                    onChange={(e) => setVelocityPercentage(Number(e.target.value))}
                    disabled={isSuccess}
                    className="w-full accent-amber-500 hover:accent-amber-400 transition-all disabled:opacity-50"
                />
            </div>

            {/* Success States */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 mx-1em p-4 bg-amber-500/10 text-amber-500 rounded-xl text-center font-bold text-sm tracking-wide ring-1 ring-amber-500/30"
                    >
                        {t.success}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
