'use client'

import { useAppStore } from '@/lib/useAppStore'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ProgressRingProps {
    percentage?: number
    size?: number
    strokeWidth?: number
    color?: string
}

export function ProgressRing({ percentage, size = 32, strokeWidth = 2, color }: ProgressRingProps) {
    const store = useAppStore()
    const [mounted, setMounted] = useState(false)

    const activePercentage = percentage ?? store.localProgress
    const isComplete = percentage !== undefined ? percentage >= 100 : store.isComplete

    // Prevent hydration mismatch by only rendering the ring post-mount
    useEffect(() => {
        setMounted(true)
    }, [])

    // Gamification: Confetti on completion (only if it's the local lesson progress ring, not the hero ring)
    useEffect(() => {
        if (isComplete && mounted && percentage === undefined) {
            import('canvas-confetti').then((confetti) => {
                confetti.default({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.1, x: 0.8 },
                    colors: ['#3B82F6', '#8B5CF6', '#06B6D4']
                })
            })
        }
    }, [isComplete, mounted, percentage])

    if (!mounted) {
        return (
            <div
                className="rounded-full border border-white/10 flex justify-center items-center"
                style={{ width: size, height: size }}
            >
                <div
                    className="rounded-full border-t-2 border-neon-blue animate-spin"
                    style={{ width: size / 2, height: size / 2, borderWidth: strokeWidth }}
                />
            </div>
        )
    }

    const radius = (size / 2) - strokeWidth
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (activePercentage / 100) * circumference
    const center = size / 2

    return (
        <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
            {/* Background Track */}
            <svg className="absolute w-full h-full -rotate-90" width={size} height={size}>
                <circle
                    cx={center} cy={center} r={radius}
                    stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
                    className="text-white/10"
                />
                {/* Animated Progress Fill */}
                <motion.circle
                    cx={center} cy={center} r={radius}
                    stroke={color ? color : "url(#progressGradient)"} strokeWidth={strokeWidth} fill="transparent"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    strokeDasharray={circumference}
                />
                {!color && (
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" /> {/* Neon Violet */}
                            <stop offset="100%" stopColor="#3B82F6" /> {/* Neon Blue */}
                        </linearGradient>
                    </defs>
                )}
            </svg>

            {/* Center Label - Only render if no custom percentage is provided (since Hero has its own) */}
            {percentage === undefined && (
                <span className={`text-[9px] font-bold font-sans ${isComplete ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-slate-300'}`}>
                    {isComplete ? '★' : `${Math.round(activePercentage)}%`}
                </span>
            )}
        </div>
    )
}
