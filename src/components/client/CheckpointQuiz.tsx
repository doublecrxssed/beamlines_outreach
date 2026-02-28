'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface QuizOption {
    text: string
    isCorrect: boolean
}

interface CheckpointQuizProps {
    question: string
    options?: QuizOption[] | string
    explanation: string
    lang?: string
}

export function CheckpointQuiz(props: CheckpointQuizProps) {
    const { question, explanation, lang = 'en' } = props;

    // MDX sometimes strips complex object arrays from props.
    // If it's passed as a JSON string, parse it. Otherwise, use it if it's an array.
    let parsedOptions: QuizOption[] = [];
    if (typeof props.options === 'string') {
        try {
            parsedOptions = JSON.parse(props.options);
        } catch (e) {
            console.error("Failed to parse options string:", e);
        }
    } else if (Array.isArray(props.options)) {
        parsedOptions = props.options;
    }

    const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
    const [isRevealed, setIsRevealed] = useState(false)

    const t = {
        title: lang === 'hi' ? 'ज्ञान की जांच' : 'Knowledge Checkpoint',
        checkBtn: lang === 'hi' ? 'उत्तर जांचें' : 'Check Answer',
        correct: lang === 'hi' ? 'सही जवाब!' : 'Correct!',
        incorrect: lang === 'hi' ? 'फिर से कोशिश करें' : 'Incorrect. Try again.',
        explanationTitle: lang === 'hi' ? 'व्याख्या:' : 'Explanation:'
    }

    const handleCheck = () => {
        if (selectedIdx === null) return;
        setIsRevealed(true);
        if (parsedOptions[selectedIdx].isCorrect) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.8 },
                colors: ['#10B981', '#34D399']
            })
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto my-12 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-violet-500/20 shadow-2xl backdrop-blur-md relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/50 text-violet-400 font-bold">
                    ?
                </div>
                <h3 className="text-xl font-display font-bold text-white tracking-wide">
                    {t.title}
                </h3>
            </div>

            <p className="text-lg text-slate-200 mb-6 leading-relaxed">
                {question}
            </p>

            <div className="flex flex-col gap-3 mb-8">
                {parsedOptions.map((option, idx) => {
                    const isSelected = selectedIdx === idx;
                    let stateStyles = "bg-slate-800/80 border-slate-700 hover:bg-slate-700 hover:border-slate-500 text-slate-300";

                    if (isSelected && !isRevealed) {
                        stateStyles = "bg-violet-600/20 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]";
                    } else if (isRevealed) {
                        if (option.isCorrect) {
                            stateStyles = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                        } else if (isSelected && !option.isCorrect) {
                            stateStyles = "bg-red-500/20 border-red-500 text-red-300 opacity-50";
                        } else {
                            stateStyles = "bg-slate-800/40 border-slate-700 text-slate-500 opacity-50";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            disabled={isRevealed}
                            onClick={() => setSelectedIdx(idx)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${stateStyles}`}
                        >
                            <span className="font-medium">{option.text}</span>
                            {isRevealed && option.isCorrect && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold text-xs">
                                    ✓
                                </motion.div>
                            )}
                            {isRevealed && isSelected && !option.isCorrect && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs">
                                    ✕
                                </motion.div>
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="flex justify-between items-end">
                <button
                    onClick={handleCheck}
                    disabled={selectedIdx === null || isRevealed}
                    className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20"
                >
                    {t.checkBtn}
                </button>

                <AnimatePresence>
                    {isRevealed && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`text-sm font-bold ${parsedOptions[selectedIdx!].isCorrect ? 'text-emerald-400' : 'text-red-400'}`}
                        >
                            {parsedOptions[selectedIdx!].isCorrect ? t.correct : t.incorrect}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isRevealed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-slate-900 border-l-4 border-violet-500 rounded-r-xl">
                            <h4 className="text-violet-400 font-bold text-sm uppercase tracking-wider mb-2">{t.explanationTitle}</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {explanation}
                            </p>

                            {!parsedOptions[selectedIdx!].isCorrect && (
                                <button
                                    onClick={() => {
                                        setIsRevealed(false)
                                        setSelectedIdx(null)
                                    }}
                                    className="mt-4 text-xs font-bold text-violet-400 hover:text-violet-300 underline underline-offset-4"
                                >
                                    Try again
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
