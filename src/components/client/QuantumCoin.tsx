'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

type CoinState = 'spinning' | 'heads' | 'tails'

export function QuantumCoin({ lang = 'en' }: { lang?: string }) {
    const [singleCoinState, setSingleCoinState] = useState<CoinState>('spinning')
    const [clickCount, setClickCount] = useState(0)

    // Macro state
    const [mode, setMode] = useState<'single' | 'macro'>('single')
    const [macroCoins, setMacroCoins] = useState<CoinState[]>(Array(100).fill('spinning'))
    const [isWaveActive, setIsWaveActive] = useState(false)
    const [waveProgress, setWaveProgress] = useState(0) // 0 to 100

    const t = {
        title: lang === 'hi' ? 'क्वांटम सिक्का उछाल' : 'The Quantum Coin Toss',
        catch: lang === 'hi' ? 'सिक्का पकड़ो' : 'Catch the Coin',
        reset: lang === 'hi' ? 'फिर से उछालो' : 'Toss Again',
        unlock: lang === 'hi' ? '100 सिक्के उछालें' : 'Toss 100 Coins at Once',
        heads: lang === 'hi' ? 'चित (Heads)' : 'Heads',
        tails: lang === 'hi' ? 'पट (Tails)' : 'Tails',
        macroBtn: lang === 'hi' ? 'अवलोकन तरंग भेजें' : 'Send Observation Wave',
        stats: lang === 'hi' ? 'सांख्यिकीय वितरण' : 'Statistical Distribution'
    }

    // Single Coin Logic
    const catchSingleCoin = () => {
        if (singleCoinState !== 'spinning') return
        const result = Math.random() > 0.5 ? 'heads' : 'tails'
        setSingleCoinState(result)
        setClickCount(c => c + 1)
    }

    const resetSingle = () => {
        setSingleCoinState('spinning')
    }

    // Macro Logic
    const startWave = () => {
        if (isWaveActive) return
        setMacroCoins(Array(100).fill('spinning'))
        setIsWaveActive(true)
        setWaveProgress(0)
    }

    useEffect(() => {
        if (!isWaveActive) return

        let rafId: number
        const duration = 2000 // Wave takes 2 seconds to cross
        const startTime = performance.now()

        const animateWave = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min((elapsed / duration) * 100, 100)
            setWaveProgress(progress)

            // Calculate how many coins should be collapsed based on progress
            // 10x10 grid. Each column is 10% of width.
            const collapsedCols = Math.floor(progress / 10)

            setMacroCoins(prev => {
                const next = [...prev]
                for (let i = 0; i < 100; i++) {
                    const col = i % 10
                    if (col < collapsedCols && next[i] === 'spinning') {
                        next[i] = Math.random() > 0.5 ? 'heads' : 'tails'
                    }
                }
                return next
            })

            if (progress < 100) {
                rafId = requestAnimationFrame(animateWave)
            } else {
                setIsWaveActive(false)
                // Ensure all are collapsed
                setMacroCoins(prev => prev.map(c => c === 'spinning' ? (Math.random() > 0.5 ? 'heads' : 'tails') : c))
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.8 },
                    colors: ['#3B82F6', '#EF4444']
                })
            }
        }

        rafId = requestAnimationFrame(animateWave)
        return () => cancelAnimationFrame(rafId)
    }, [isWaveActive])

    const macroHeads = macroCoins.filter(c => c === 'heads').length
    const macroTails = macroCoins.filter(c => c === 'tails').length

    return (
        <div className="w-full max-w-3xl mx-auto my-12 bg-gray-900/40 p-1em rounded-3xl border border-white/5 backdrop-blur-xl group">
            <h3 className="text-xl font-display font-medium text-white/80 mb-6 px-1em text-center">
                {t.title}
            </h3>

            {/* Mode Toggle Tabs (Unlocks after 3 clicks) */}
            {clickCount >= 3 && (
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        onClick={() => setMode('single')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'single' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        Single Coin
                    </button>
                    <button
                        onClick={() => setMode('macro')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'macro' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {t.unlock}
                    </button>
                </div>
            )}

            {mode === 'single' ? (
                /* SINGLE COIN MODE */
                <div className="flex flex-col items-center justify-center p-8 bg-black/60 rounded-2xl border-4 border-slate-700 shadow-inner mb-6 relative h-[300px]">

                    <div className="relative w-32 h-32 mb-8 perspective-[1000px]">
                        <AnimatePresence mode="popLayout">
                            {singleCoinState === 'spinning' && (
                                <motion.div
                                    key="spin"
                                    className="absolute inset-0 rounded-full border-4 border-slate-400 bg-gradient-to-tr from-slate-200 to-slate-500 shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center text-3xl opacity-50 blur-[2px]"
                                    animate={{ rotateY: 360 }}
                                    transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                                    exit={{ scale: 0, opacity: 0 }}
                                >
                                    ?
                                </motion.div>
                            )}

                            {singleCoinState === 'heads' && (
                                <motion.div
                                    key="heads"
                                    initial={{ scale: 2, opacity: 0, rotateY: 90 }}
                                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                    className="absolute inset-0 rounded-full border-4 border-blue-400 bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.8)] flex flex-col items-center justify-center text-white font-bold"
                                >
                                    <span className="text-3xl">H</span>
                                    <span className="text-xs uppercase opacity-70">Up</span>
                                </motion.div>
                            )}

                            {singleCoinState === 'tails' && (
                                <motion.div
                                    key="tails"
                                    initial={{ scale: 2, opacity: 0, rotateY: -90 }}
                                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                    className="absolute inset-0 rounded-full border-4 border-red-400 bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.8)] flex flex-col items-center justify-center text-white font-bold"
                                >
                                    <span className="text-3xl">T</span>
                                    <span className="text-xs uppercase opacity-70">Down</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-4 z-10">
                        {singleCoinState === 'spinning' ? (
                            <button onClick={catchSingleCoin} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold tracking-wide transform active:scale-95 transition-all shadow-lg ring-2 ring-violet-400/50">
                                {t.catch}
                            </button>
                        ) : (
                            <button onClick={resetSingle} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold tracking-wide transition-all">
                                {t.reset}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* MACRO MODE (100 Coins) */
                <div className="flex flex-col w-full p-4 bg-black/60 rounded-2xl border-4 border-slate-700 shadow-inner mb-6 relative">

                    <button
                        onClick={startWave}
                        disabled={isWaveActive || (macroHeads + macroTails === 100 && macroHeads > 0)}
                        className="mb-6 px-6 py-3 mx-auto bg-violet-600 text-white rounded-xl font-bold disabled:bg-slate-800 disabled:text-slate-500 transition-all z-20"
                    >
                        {t.macroBtn}
                    </button>

                    <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-white/5 p-4 flex flex-col justify-between">

                        {/* 10x10 Grid of tiny coins */}
                        <div className="grid grid-cols-10 gap-2 h-full z-10 w-full mb-4">
                            {macroCoins.map((state, i) => (
                                <div key={i} className="w-full flex justify-center items-center">
                                    {state === 'spinning' && (
                                        <motion.div
                                            className="w-4 h-4 rounded-full bg-slate-400 opacity-50 blur-[1px]"
                                            animate={{ rotateY: 360 }}
                                            transition={{ duration: 0.1 + ((i * 13) % 10) * 0.02, repeat: Infinity, ease: "linear" }}
                                        />
                                    )}
                                    {state === 'heads' && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" />
                                    )}
                                    {state === 'tails' && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Distribution Graph underneath */}
                        <div className="h-12 w-full flex items-end justify-center px-[20%] z-0 relative">
                            <div className="flex w-full items-end justify-between h-full border-b-2 border-slate-600 pb-1">
                                <motion.div
                                    className="w-8 bg-blue-500 rounded-t-sm"
                                    animate={{ height: `${macroHeads}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                                <div className="text-xs font-mono text-slate-500 absolute top-0 w-full text-center">{t.stats}</div>
                                <motion.div
                                    className="w-8 bg-red-500 rounded-t-sm"
                                    animate={{ height: `${macroTails}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            {/* Labels */}
                            <div className="absolute -bottom-5 w-full flex justify-between px-[20%] text-[10px] uppercase font-bold text-slate-500">
                                <span className="text-blue-400">Heads: {macroHeads}</span>
                                <span className="text-red-400">Tails: {macroTails}</span>
                            </div>
                        </div>

                        {/* The Sweeping Wave Visual */}
                        {isWaveActive && (
                            <div
                                className="absolute top-0 bottom-0 w-[50px] bg-gradient-to-r from-transparent via-white/30 to-white/80 shadow-[0_0_30px_rgba(255,255,255,0.6)] mix-blend-screen pointer-events-none z-20"
                                style={{
                                    left: `calc(${waveProgress}% - 50px)`
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
