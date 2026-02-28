'use client'

import { useAppStore } from '@/lib/useAppStore'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ProgressRing() {
    const { localProgress, isComplete } = useAppStore()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch by only rendering the ring post-mount
    useEffect(() => {
        setMounted(true)
    }, [])

    // Gamification: Confetti on completion
    useEffect(() => {
        if (isComplete && mounted) {
            import('canvas-confetti').then((confetti) => {
                confetti.default({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.1, x: 0.8 },
                    colors: ['#3B82F6', '#8B5CF6', '#06B6D4']
                })
            })
        }
    }, [isComplete, mounted])

    if (!mounted) {
        return (
            <div className="w-8 h-8 rounded-full border border-white/10 flex justify-center items-center">
                <div className="w-4 h-4 rounded-full border-t-2 border-neon-blue animate-spin" />
            </div>
        )
    }

    const radius = 14
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (localProgress / 100) * circumference

    return (
        <div className="relative w-8 h-8 flex justify-center items-center">
            {/* Background Track */}
            <svg className="absolute w-full h-full -rotate-90">
                <circle
                    cx="16" cy="16" r={radius}
                    stroke="currentColor" strokeWidth="2" fill="transparent"
                    className="text-white/10"
                />
                {/* Animated Progress Fill */}
                <motion.circle
                    cx="16" cy="16" r={radius}
                    stroke="url(#progressGradient)" strokeWidth="2" fill="transparent"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    strokeDasharray={circumference}
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" /> {/* Neon Violet */}
                        <stop offset="100%" stopColor="#3B82F6" /> {/* Neon Blue */}
                    </linearGradient>
                </defs>
            </svg>

            {/* Center Label */}
            <span className={`text-[9px] font-bold font-sans ${isComplete ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-slate-300'}`}>
                {isComplete ? '★' : `${Math.round(localProgress)}%`}
            </span>
        </div>
    )
}
