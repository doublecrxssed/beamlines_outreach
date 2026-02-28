'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useAppStore } from '@/lib/useAppStore'

type SubjectType = 'celebrity' | 'student' | 'ghost'

interface Subject {
    id: SubjectType
    label_en: string
    label_hi: string
    desc_en: string
    desc_hi: string
    baseMass: number // Affects drag resistance
    color: string
    icon: string
    particlesRequired: number // How many Higgs bosons will swarm them
}

const SUBJECTS: Subject[] = [
    {
        id: 'celebrity',
        label_en: 'Celebrity (Top Quark)',
        label_hi: 'सेलिब्रिटी (टॉप क्वार्क)',
        desc_en: 'High interaction with the field. Enormous mass.',
        desc_hi: 'क्षेत्र के साथ उच्च संपर्क। विशाल द्रव्यमान।',
        baseMass: 0.95,
        color: '#ef4444',
        icon: 'T',
        particlesRequired: 40
    },
    {
        id: 'student',
        label_en: 'Student (Electron)',
        label_hi: 'छात्र (इलेक्ट्रॉन)',
        desc_en: 'Low interaction with the field. Minimal mass.',
        desc_hi: 'क्षेत्र के साथ कम संपर्क। न्यूनतम द्रव्यमान।',
        baseMass: 0.2,
        color: '#06b6d4',
        icon: 'e⁻',
        particlesRequired: 5
    },
    {
        id: 'ghost',
        label_en: 'Ghost (Photon)',
        label_hi: 'भूत (फोटॉन)',
        desc_en: 'Zero interaction. Zero mass. Travels at light speed.',
        desc_hi: 'शून्य संपर्क। शून्य द्रव्यमान। प्रकाश की गति से यात्रा करता है।',
        baseMass: 0,
        color: '#eab308',
        icon: 'γ',
        particlesRequired: 0
    }
]

// Background "crowd" particles representing the Higgs Field.
interface HiggsParticle {
    id: number;
    initialX: number;
    initialY: number;
    targetX?: number;
    targetY?: number;
    isSwarming: boolean;
}

export function HiggsBazaar({ lang = 'en' }: { lang?: string }) {
    const { incrementProgress } = useAppStore()
    const [activeSubject, setActiveSubject] = useState<SubjectType>('student')
    const [interacting, setInteracting] = useState(false)
    const [progress, setProgress] = useState(0) // 0 to 1 across the track

    const trackRef = useRef<HTMLDivElement>(null)
    const [trackWidth, setTrackWidth] = useState(0)
    const [particles, setParticles] = useState<HiggsParticle[]>([])

    // Drag positioning
    const x = useMotionValue(0)

    // Derived values for visual UI
    const subject = SUBJECTS.find(s => s.id === activeSubject)!
    const dragResistance = interacting ? subject.baseMass : 0.05

    // Visual effort indicator (red shift based on effort)
    const effortGlow = useTransform(x, [0, trackWidth], ['rgba(255,255,255,0)', `rgba(239, 68, 68, ${subject.baseMass * 0.5})`])

    // Localization Helpers
    const t = {
        title: lang === 'hi' ? 'द हिग्स बाज़ार' : 'The Higgs Bazaar',
        desc: lang === 'hi' ? 'भीड़ के माध्यम से कण को ​​खींचें।' : 'Drag the particle through the crowd.',
        dragTarget: lang === 'hi' ? 'खींचें' : 'DRAG',
        massLabel: lang === 'hi' ? 'द्रव्यमान (Mass):' : 'Effective Mass:',
        interactionLabel: lang === 'hi' ? 'हिग्स इंटरेक्शन:' : 'Higgs Interaction:',
        success: lang === 'hi' ? 'प्रयोग पूरा हुआ!' : 'Experiment Complete!'
    }

    // Initialize the "Bazaar" (the random scattering of Higgs bosons in the track)
    useEffect(() => {
        if (!trackRef.current) return;
        const width = trackRef.current.offsetWidth;
        const height = trackRef.current.offsetHeight;
        setTrackWidth(width);

        // Generate uniform scatter
        const newParticles: HiggsParticle[] = [];
        for (let i = 0; i < 150; i++) {
            newParticles.push({
                id: i,
                initialX: Math.random() * width,
                initialY: Math.random() * height,
                isSwarming: false
            });
        }
        setParticles(newParticles);
    }, []);

    // When X changes, update the swarm mechanics!
    useEffect(() => {
        const unsubscribe = x.on("change", (latestX) => {
            const ratio = Math.max(0, Math.min(1, latestX / Math.max(1, trackWidth - 80)));
            setProgress(ratio);

            if (ratio > 0.98) {
                incrementProgress('higgs-bazaar', 'no-math');
            }

            // Update Particle swarm logic
            // The Subject has an X position (latestX) and a Y position (center of track vertically)
            // If the subject is heavy, particles close to it get "sucked in" (swarming).
            if (!interacting) return;

            setParticles(prev => prev.map((p) => {
                const subjectCenterX = latestX + 40; // 80px width / 2

                // If it's the Ghost (0 mass), no particles EVER swarm.
                if (subject.particlesRequired === 0) {
                    return { ...p, isSwarming: false };
                }

                // Distance from particle's initial resting place to the moving subject
                const distX = Math.abs(p.initialX - subjectCenterX);

                // If the particle is within the "attraction radius", it swarms. Heavy subjects have bigger radiuses.
                const attractionRadius = 80 + (subject.particlesRequired * 2);

                if (distX < attractionRadius) {
                    // Swarm mode! Calculate a target coordinate clustered around the subject
                    return {
                        ...p,
                        isSwarming: true,
                        targetX: subjectCenterX + (Math.random() * 60 - 30),
                        targetY: (trackRef.current?.offsetHeight || 160) / 2 + (Math.random() * 60 - 30)
                    }
                } else {
                    return { ...p, isSwarming: false };
                }
            }));
        });
        return () => unsubscribe();
    }, [x, trackWidth, subject, interacting, incrementProgress]);

    return (
        <div className="glass-panel rounded-[2em] p-[2em] my-[3em] relative overflow-hidden ring-1 ring-white/10">
            {/* Header */}
            <div className="text-center mb-[2rem] relative z-10">
                <h3 className="text-[2em] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet">{t.title}</h3>
                <p className="text-slate-400 text-[1.1em]">{t.desc}</p>
            </div>

            {/* Subject Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-[2rem] relative z-10">
                {SUBJECTS.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => {
                            setActiveSubject(s.id);
                            x.set(0); // Reset position
                            setProgress(0);
                        }}
                        className={`px-4 py-2 rounded-xl transition-all font-bold tracking-wide border-2 ${activeSubject === s.id ? 'bg-white/10 shadow-lg' : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5'}`}
                        style={{
                            borderColor: activeSubject === s.id ? s.color : 'transparent',
                            color: activeSubject === s.id ? s.color : undefined
                        }}
                    >
                        <span className="mr-2 text-lg">{s.icon}</span>
                        {lang === 'hi' ? s.label_hi : s.label_en}
                    </button>
                ))}
            </div>

            {/* Stats Panel */}
            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider mb-2 px-4 relative z-10" style={{ color: subject.color }}>
                <div>{t.massLabel} <span className="text-white ml-2">{(subject.baseMass * 100).toFixed(0)}%</span></div>
                <div>{t.interactionLabel} <span className="text-white ml-2">{subject.particlesRequired > 0 ? 'HIGH' : 'NONE'}</span></div>
            </div>

            {/* The Track (The Bazaar) */}
            <div
                ref={trackRef}
                className="relative h-[160px] w-full rounded-2xl border border-white/20 bg-[#050810] overflow-hidden"
                style={{
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
                }}
            >
                {/* Render the Higgs Boson "Crowd" */}
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute w-2 h-2 rounded-full bg-white/20"
                        animate={{
                            x: p.isSwarming ? p.targetX : p.initialX,
                            y: p.isSwarming ? p.targetY : p.initialY,
                            opacity: p.isSwarming ? 0.8 : 0.2,
                            scale: p.isSwarming ? 1.5 : 1,
                            backgroundColor: p.isSwarming ? subject.color : '#ffffff'
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: p.isSwarming ? 150 : 50,
                            damping: p.isSwarming ? 15 : 20
                        }}
                    />
                ))}

                {/* The Draggable Subject */}
                <motion.div
                    drag="x"
                    dragConstraints={trackRef}
                    dragElastic={0} // Important: 0 elastic means it stops exactly at track edges
                    dragMomentum={false}
                    onDragStart={() => setInteracting(true)}
                    onDragEnd={() => setInteracting(false)}
                    style={{ x, scale: interacting ? 1.1 : 1 }}
                    className="absolute top-1/2 -translate-y-1/2 left-0 w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-50 backdrop-blur-md"
                >
                    {/* Ring visual reflecting subject color */}
                    <div
                        className="absolute inset-0 rounded-full border-[3px]"
                        style={{ borderColor: subject.color, boxShadow: `0 0 20px ${subject.color}60` }}
                    />

                    {/* Particle Icon */}
                    <span className="text-3xl font-bold text-white drop-shadow-md z-10">{subject.icon}</span>

                    {/* Faux drag resistance logic: 
                        If baseMass is high, drag visually lags the mouse mathematically using a dampener on actual pointer movement.
                        Since standard framer-motion drag acts 1:1, we simulate "heavy" by drastically slowing the visual velocity 
                        using a trailing spring or manually scaling the X value down, but for raw `drag='x'`, we can manipulate 
                        `dragElastic` or simply let the user FEEL the swarm. 
                        Because `drag={true}` is strictly 1:1, we achieve the psychological feel of "mass" by visually expanding the 
                        swarming particles and showing the red "effort" glow!
                    */}
                    <motion.div
                        className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none"
                        style={{ backgroundColor: effortGlow }}
                    />
                </motion.div>

                {/* Destination Drop Zone */}
                <div className="absolute right-0 top-0 bottom-0 w-[100px] border-l border-white/10 bg-gradient-to-l from-neon-blue/20 to-transparent flex items-center justify-center pointer-events-none">
                    <span className="text-neon-blue/40 font-bold uppercase tracking-widest rotate-90 opacity-50">{t.dragTarget}</span>
                </div>
            </div>

            {/* Descriptive Context Banner */}
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-center leading-relaxed font-medium">
                {lang === 'hi' ? subject.desc_hi : subject.desc_en}
            </div>

            {/* Success Overlay */}
            {progress > 0.98 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-space-950/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-[2em]"
                >
                    <div className="text-center">
                        <div className="text-5xl mb-4">🎉</div>
                        <h4 className="text-2xl font-bold text-neon-cyan mb-2">{t.success}</h4>
                        <button
                            onClick={() => {
                                x.set(0);
                                setProgress(0);
                            }}
                            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-colors"
                        >
                            {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try Another'}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
