'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/useAppStore'

interface MathGateProps {
    children: React.ReactNode
    buttonText?: string
    topicId?: string
}

export function MathGate({ children, buttonText = "See the Math", topicId = "standard-model" }: MathGateProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { incrementProgress } = useAppStore()

    const handleToggle = () => {
        const newState = !isOpen
        setIsOpen(newState)

        // Log progress when a user actually engages with the math
        if (newState) {
            incrementProgress(topicId, 'full-math')
        }
    }

    return (
        <div className="my-8">
            {/* Contextual Toggle Button */}
            <button
                onClick={handleToggle}
                className="group relative flex items-center gap-2 px-4 py-2 rounded-full border border-neon-violet/30 bg-neon-violet/10 hover:bg-neon-violet/20 transition-all duration-300 backdrop-blur-sm"
            >
                <div className={`w-2 h-2 rounded-full bg-neon-violet shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-transform duration-300 ${isOpen ? 'scale-150' : ''}`} />
                <span className="text-sm font-semibold text-neon-violet group-hover:text-white transition-colors">
                    {isOpen ? "Hide Math" : buttonText}
                </span>
            </button>

            {/* Expandable Content Area */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 rounded-2xl glass-panel border-l-4 border-l-neon-violet">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
