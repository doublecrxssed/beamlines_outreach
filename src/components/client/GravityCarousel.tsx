'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/useAppStore'

// A Star in our 2D Galaxy
interface Star {
    id: number
    radius: number // Distance from center
    angle: number  // Current angle in radians
    speedMultiplier: number // How fast it rotates relative to others
    size: number
    color: string
    isDetached: boolean // Has it flown off?
    velocityX: number   // If detached, its linear velocity X
    velocityY: number   // If detached, its linear velocity Y
    x: number          // Current absolute X
    y: number          // Current absolute Y
}

export function GravityCarousel({ lang = 'en' }: { lang?: string }) {
    const { incrementProgress } = useAppStore()

    // --- State ---
    const [speedMultiplier, setSpeedMultiplier] = useState(1) // 1x to 10x
    const [darkMatterActive, setDarkMatterActive] = useState(false)
    const [stars, setStars] = useState<Star[]>([])

    // Animation refs
    const requestRef = useRef<number | undefined>(undefined)
    const lastTimeRef = useRef<number | undefined>(undefined)
    const containerRef = useRef<HTMLDivElement>(null)

    // Derived flags
    const isCriticalSpeed = speedMultiplier > 5
    const isRippingApart = isCriticalSpeed && !darkMatterActive

    // Localization Helpers
    const t = {
        title: lang === 'hi' ? 'गुरुत्वाकर्षण हिंडोला' : 'The Gravity Carousel',
        desc: lang === 'hi' ? 'गैलेक्सी के घूमने की गति को नियंत्रित करें।' : 'Control the rotation speed of the galaxy.',
        speedLabel: lang === 'hi' ? 'घूमने की गति:' : 'Rotation Speed:',
        dmLabel: lang === 'hi' ? 'डार्क मैटर हेलो इंजेक्ट करें' : 'Inject Dark Matter Halo',
        dmActive: lang === 'hi' ? 'डार्क मैटर सक्रिय!' : 'Dark Matter Active!',
        warning: lang === 'hi' ? 'चेतावनी: बहुत तेज़! गुरुत्वाकर्षण टूट रहा है!' : 'WARNING: TOO FAST! Gravity is failing!',
        stable: lang === 'hi' ? 'स्थिर गुरुत्वाकर्षण क्षेत्र' : 'Stable Gravitational Field',
        success: lang === 'hi' ? 'अदृश्य गुरुत्वाकर्षण ने गैलेक्सी को बचा लिया!' : 'The invisible gravity saved the galaxy!'
    }

    // Initialize Stars
    useEffect(() => {
        const colors = ['#fde047', '#fef08a', '#bae6fd', '#e0f2fe', '#fbcfe8']
        const initialStars: Star[] = []

        // Create 200 stars distributed in spiral arms
        for (let i = 0; i < 200; i++) {
            // Skew distribution towards the center
            const distanceFactor = Math.random() * Math.random()
            const radius = 20 + (distanceFactor * 140) // 20px to 160px from center

            // Artificial spiral arms (3 arms)
            const armOffset = (i % 3) * ((Math.PI * 2) / 3)
            const angle = armOffset + (radius * 0.05) + (Math.random() * 0.5 - 0.25)

            initialStars.push({
                id: i,
                radius,
                angle,
                // Kepler's approximation: outer stars *should* move slower, but we just give them a base multiplier
                speedMultiplier: 1.5 - (radius / 300),
                size: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                isDetached: false,
                velocityX: 0,
                velocityY: 0,
                x: 0,
                y: 0
            })
        }
        setStars(initialStars)
    }, [])

    // Primary Animation Loop
    const animate = (time: number) => {
        if (lastTimeRef.current !== undefined) {
            const deltaTime = (time - lastTimeRef.current) / 1000 // seconds

            setStars(prevStars => prevStars.map(star => {
                const newStar = { ...star }

                if (newStar.isDetached) {
                    // Linear motion into deep space!
                    newStar.x += newStar.velocityX * deltaTime * 60
                    newStar.y += newStar.velocityY * deltaTime * 60
                } else {
                    // Orbital motion
                    // Base orbital speed calculation
                    const baseAngularVelocity = 0.5 * newStar.speedMultiplier // radians per second
                    const currentAngularVelocity = baseAngularVelocity * speedMultiplier

                    newStar.angle += currentAngularVelocity * deltaTime

                    // Check if gravitational binding breaks (only outer stars fly off first!)
                    // Escape threshold: Critical speed + No Dark Matter + Outer Rim (radius > 80)
                    if (speedMultiplier > 5 && !darkMatterActive && newStar.radius > 80) {
                        // 2% chance per frame to break free at critical speeds to make it ragged
                        if (Math.random() < 0.02 * (speedMultiplier - 4)) {
                            newStar.isDetached = true
                            // Tangential velocity vector
                            const linearSpeed = newStar.radius * currentAngularVelocity
                            newStar.velocityX = -Math.sin(newStar.angle) * linearSpeed * 0.5
                            newStar.velocityY = Math.cos(newStar.angle) * linearSpeed * 0.5
                        }
                    }

                    // Convert polar to cartesian (centered at 0,0)
                    newStar.x = Math.cos(newStar.angle) * newStar.radius
                    newStar.y = Math.sin(newStar.angle) * newStar.radius
                }

                return newStar
            }))
        }

        lastTimeRef.current = time
        requestRef.current = requestAnimationFrame(animate)
    }

    // Start/Stop engine
    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate)
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speedMultiplier, darkMatterActive]) // Need to restart loop with new state closures

    // Success Tracker
    useEffect(() => {
        if (isCriticalSpeed && darkMatterActive) {
            const timer = setTimeout(() => {
                incrementProgress('gravity-carousel', 'no-math')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isCriticalSpeed, darkMatterActive, incrementProgress])

    return (
        <div className="glass-panel text-white rounded-[2em] p-[2em] my-[3em] relative overflow-hidden ring-1 ring-white/10" ref={containerRef}>

            {/* Background Plates */}
            <div className="absolute inset-0 bg-gradient-to-b from-space-900 to-space-950 -z-20" />

            {/* Dark Matter Halo Visual */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: darkMatterActive ? 1 : 0, scale: darkMatterActive ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="text-center mb-[2em] relative z-10">
                <h3 className="text-[2em] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet">{t.title}</h3>
                <p className="text-slate-400 text-[1.1em]">{t.desc}</p>
            </div>

            {/* Viewport rendering the Stars */}
            <div className="relative w-full h-[350px] bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] mb-[2em]">
                {/* Center of the Galaxy (Supermassive Black Hole) */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_30px_rgba(255,255,255,1)] z-20" />

                {/* Dark Matter Center Glow */}
                <motion.div
                    className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0) 70%)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: darkMatterActive ? 1 : 0 }}
                    transition={{ duration: 1 }}
                />

                {/* Stars */}
                <div className="absolute top-1/2 left-1/2 z-10">
                    {stars.map(star => {
                        // Hide stars that have flown way off screen
                        if (Math.abs(star.x) > 400 || Math.abs(star.y) > 400) return null

                        return (
                            <div
                                key={star.id}
                                className="absolute rounded-full"
                                style={{
                                    left: `${star.x}px`,
                                    top: `${star.y}px`,
                                    width: `${star.size}px`,
                                    height: `${star.size}px`,
                                    backgroundColor: star.color,
                                    transform: 'translate(-50%, -50%)',
                                    opacity: star.isDetached ? 0.3 : (1 - (star.radius / 200)), // Fade outer stars slightly
                                    boxShadow: `0 0 ${star.size * 2}px ${star.color}`
                                }}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-[1.5em] relative z-20">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-slate-300 whitespace-nowrap">{t.speedLabel}</span>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={speedMultiplier}
                        onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isRippingApart ? 'bg-red-500/50' : 'bg-slate-700'}`}
                    />
                    <span className={`font-mono font-bold w-12 text-right ${isRippingApart ? 'text-red-400' : 'text-neon-cyan'}`}>
                        {speedMultiplier.toFixed(1)}x
                    </span>
                </div>

                <div className="flex justify-between items-center bg-[#050810]/80 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isRippingApart ? 'bg-red-500 animate-pulse' : darkMatterActive ? 'bg-neon-violet' : 'bg-neon-cyan'}`} />
                        <span className={`font-bold text-sm uppercase tracking-wide ${isRippingApart ? 'text-red-400' : 'text-slate-300'}`}>
                            {isRippingApart ? t.warning : darkMatterActive ? t.stable : t.stable}
                        </span>
                    </div>

                    <button
                        onClick={() => {
                            setDarkMatterActive(!darkMatterActive)
                            // If re-activating, any detached stars are lost, but new ones won't detach.
                            // The simulation handles this elegantly!
                        }}
                        className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all border-2 ${darkMatterActive
                            ? 'bg-neon-violet/20 border-neon-violet text-neon-violet shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                            : 'bg-transparent border-slate-600 text-slate-400 hover:border-slate-400 hover:text-white'
                            }`}
                    >
                        {darkMatterActive ? t.dmActive : t.dmLabel}
                    </button>
                </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {isCriticalSpeed && darkMatterActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-neon-violet/20 border border-neon-violet text-neon-violet px-6 py-3 rounded-full font-bold tracking-widest backdrop-blur-md z-50 text-center shadow-[0_0_30px_rgba(139,92,246,0.3)] pointer-events-none"
                    >
                        {t.success}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
