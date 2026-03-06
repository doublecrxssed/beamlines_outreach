'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/lib/useAppStore'
import { Settings2, Eye, Type, ZapOff, Captions, ZoomIn } from 'lucide-react'

export function A11yMenu() {
    const {
        isHighContrast, toggleHighContrast,
        isDyslexicFont, toggleDyslexicFont,
        isReducedMotion, toggleReducedMotion,
        isScreenReaderMode, toggleScreenReaderMode,
        isLargeText, toggleLargeText
    } = useAppStore()

    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), [])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!mounted) return <div className="w-10 h-10" />

    const A11yOption = ({
        icon: Icon,
        label,
        description,
        isActive,
        onToggle
    }: {
        icon: any,
        label: string,
        description: string,
        isActive: boolean,
        onToggle: () => void
    }) => (
        <button
            onClick={onToggle}
            className={`w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-white/5 
                ${isActive ? 'bg-neon-blue/10 border-l-2 border-neon-blue' : 'border-l-2 border-transparent'}`}
            role="switch"
            aria-checked={isActive}
        >
            <div className={`mt-0.5 ${isActive ? 'text-neon-blue' : 'text-slate-400'}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className={`font-medium text-sm ${isActive ? 'text-white' : 'text-slate-200'}`}>
                    {label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                    {description}
                </p>
            </div>
            <div className="ml-auto flex items-center">
                <div className={`w-8 h-4 rounded-full transition-colors relative
                    ${isActive ? 'bg-neon-blue' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform
                        ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
            </div>
        </button>
    )

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors flex items-center justify-center
                    ${(isHighContrast || isDyslexicFont || isReducedMotion || isScreenReaderMode || isLargeText)
                        ? 'bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                aria-label="Accessibility Menu"
                aria-expanded={isOpen}
            >
                <Settings2 size={20} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 w-72 glass-card rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right z-50 h-[60vh] overflow-y-auto custom-scrollbar"
                    role="menu"
                >
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5 sticky top-0 z-10 backdrop-blur-xl">
                        <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                            <Settings2 size={16} className="text-neon-blue" />
                            Accessibility Tools
                        </h3>
                    </div>

                    <div className="py-2 flex flex-col">
                        <A11yOption
                            icon={Eye}
                            label="High Contrast"
                            description="Pure black backgrounds and maximum contrast neons."
                            isActive={isHighContrast}
                            onToggle={toggleHighContrast}
                        />
                        <A11yOption
                            icon={ZoomIn}
                            label="Large Text"
                            description="Uniformly scales up the entire application interface."
                            isActive={isLargeText}
                            onToggle={toggleLargeText}
                        />
                        <A11yOption
                            icon={Type}
                            label="Dyslexia Font"
                            description="Swaps system fonts to the highly legible Atma typeface."
                            isActive={isDyslexicFont}
                            onToggle={toggleDyslexicFont}
                        />
                        <A11yOption
                            icon={ZapOff}
                            label="Reduced Motion"
                            description="Disables all CSS animations and scroll transitions."
                            isActive={isReducedMotion}
                            onToggle={toggleReducedMotion}
                        />
                        <A11yOption
                            icon={Captions}
                            label="Screen Reader Mode"
                            description="Visually reveals hidden descriptive text for interactives."
                            isActive={isScreenReaderMode}
                            onToggle={toggleScreenReaderMode}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
