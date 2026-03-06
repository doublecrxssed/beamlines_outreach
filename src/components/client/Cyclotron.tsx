'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import * as THREE from 'three'

// ----------------------------------------------------------------------------
// 3D Scene Components
// ----------------------------------------------------------------------------

function DeePlates() {
    return (
        <group>
            {/* Left Dee (Flat 2D Shape) */}
            <mesh position={[-2.2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 5, 32, 1, Math.PI / 2, Math.PI]} />
                <meshBasicMaterial
                    color="#1e293b"
                    transparent
                    opacity={0.4}
                    side={THREE.DoubleSide}
                />
                {/* Glowing Outline */}
                <lineLoop>
                    <edgesGeometry args={[new THREE.RingGeometry(0.5, 5, 32, 1, Math.PI / 2, Math.PI)]} />
                    <lineBasicMaterial color="#3b82f6" transparent opacity={0.6} linewidth={2} />
                </lineLoop>
            </mesh>

            {/* Right Dee (Flat 2D Shape) */}
            <mesh position={[2.2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 5, 32, 1, -Math.PI / 2, Math.PI]} />
                <meshBasicMaterial
                    color="#1e293b"
                    transparent
                    opacity={0.4}
                    side={THREE.DoubleSide}
                />
                {/* Glowing Outline */}
                <lineLoop>
                    <edgesGeometry args={[new THREE.RingGeometry(0.5, 5, 32, 1, -Math.PI / 2, Math.PI)]} />
                    <lineBasicMaterial color="#3b82f6" transparent opacity={0.6} linewidth={2} />
                </lineLoop>
            </mesh>

            {/* Gap subtle visualizer */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[4.4, 10]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} />
            </mesh>
        </group>
    )
}

function MagneticFieldGrid({ intensity }: { intensity: number }) {
    // A subtle pulsing base grid to represent the magnetic field crossing the plane
    return (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[5.5, 32]} />
            <meshBasicMaterial
                color="#8b5cf6"
                transparent
                opacity={0.05 + (intensity / 100) * 0.15}
                wireframe
            />
        </mesh>
    )
}

function Proton({ electricField, magneticField, isSuccess, onError }: { electricField: number, magneticField: number, isSuccess: boolean, onError: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null)

    // Physics State
    const pos = useRef(new THREE.Vector3(0.01, 0, 0)) // Start slightly offset to begin rotation
    const time = useRef(0)
    const radius = useRef(0.01)
    const speed = useRef(0.05)

    // Reset trail
    const [trail, setTrail] = useState<THREE.Vector3[]>([])

    // Physics constants mapped from 0-100 sliders
    const E_FORCE = 0.001 + (electricField / 100) * 0.015  // Acceleration across gap
    const B_FORCE = 0.01 + (magneticField / 100) * 0.1     // Turning force inside Dees

    useFrame((state) => {
        if (!meshRef.current) return

        // If success is achieved, let particle fly off cleanly to the right
        if (isSuccess) {
            pos.current.x += 0.2
            meshRef.current.position.copy(pos.current)
            return
        }

        // If fields are zero, reset to center
        if (electricField === 0 && magneticField === 0) {
            pos.current.set(0.01, 0, 0)
            radius.current = 0.01
            speed.current = 0.05
            time.current = 0
            setTrail([])
            meshRef.current.position.copy(pos.current)
            return
        }

        // --- CYCLOTRON PHYSICS APPROXIMATION ---

        // 1. Are we in the structural gap between the Dees? (x between -2.2 and 2.2)
        const inGap = Math.abs(pos.current.x) < 2.2

        if (inGap) {
            // In the gap, electric field accelerates particle strictly outward (increasing radius/speed)
            speed.current += E_FORCE
            radius.current += E_FORCE * 5

            // Move linearly across the gap
            pos.current.x += Math.sign(pos.current.x || 1) * speed.current
        } else {
            // Inside the Dees, magnetic field turns the particle in a circle
            // Angular velocity omega = v / r.  Higher B_FORCE makes tighter circles.

            // If B field is extremely weak compared to speed, the radius blows up (Crash)
            if (speed.current > B_FORCE * 2 && electricField > 90) {
                onError()
                return
            }

            const omega = B_FORCE
            time.current += omega

            // Circular orbit equations
            const signX = pos.current.x > 0 ? 1 : -1
            const centerX = signX * 2.2 // Orbit around the center of the respective Dee half

            pos.current.z = Math.sin(time.current) * radius.current
            pos.current.x = centerX + Math.cos(time.current) * radius.current * -signX
        }

        // Update mesh position
        meshRef.current.position.copy(pos.current)

        // Update trail every few frames
        if (state.clock.elapsedTime * 60 % 3 < 1) {
            setTrail(prev => [...prev.slice(-60), pos.current.clone()])
        }
    })

    return (
        <group>
            {/* The particle */}
            <mesh ref={meshRef}>
                <circleGeometry args={[0.2, 32]} />
                <meshBasicMaterial color="#00ffff" />
            </mesh>

            {/* Path Trail */}
            {trail.length > 2 && (
                <Line
                    points={trail}
                    color={electricField > magneticField + 20 ? "#f97316" : "#00ffff"}
                    lineWidth={2.5}
                    transparent
                    opacity={0.6}
                />
            )}
        </group>
    )
}

// ----------------------------------------------------------------------------
// Main Component Interface
// ----------------------------------------------------------------------------

export function Cyclotron({ lang = 'en' }: { lang?: string }) {
    const [electricField, setElectricField] = useState(0)
    const [magneticField, setMagneticField] = useState(0)
    const [hasCrashed, setHasCrashed] = useState(false)

    // Derived State
    const isSuccess = electricField > 85 && magneticField > 85 && Math.abs(electricField - magneticField) < 10 && !hasCrashed
    const errorState = hasCrashed || (!isSuccess && (electricField > 90 || magneticField > 90))

    // Triggers
    useEffect(() => {
        if (isSuccess) {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#3B82F6', '#8B5CF6']
            })
        }
    }, [isSuccess])

    const handleCrash = () => {
        setHasCrashed(true)
        // Reset after 1 second
        setTimeout(() => {
            setHasCrashed(false)
            setElectricField(0)
            setMagneticField(0)
        }, 1000)
    }

    const t = {
        title: lang === 'hi' ? 'साइक्लोट्रॉन ट्यूनिंग' : 'Cyclotron Tuning',
        elec: lang === 'hi' ? 'विद्युत क्षेत्र (गति)' : 'Electric Field (Speed)',
        mag: lang === 'hi' ? 'चुंबकीय क्षेत्र (स्टीयरिंग)' : 'Magnetic Field (Steering)',
        success: lang === 'hi' ? 'अनुनाद प्राप्त हुआ! कण उत्सर्जित।' : 'Resonance Achieved! Particle Ejected.',
        fail: lang === 'hi' ? 'सिंक्रनाइज़ेशन खो गया. दीवार से टकराव!' : 'Desynchronization. Wall Collision!'
    }

    return (
        <div className="w-full max-w-3xl mx-auto my-12 glass-card p-6 rounded-3xl border border-white/10 group">
            <h3 className="text-xl font-display font-medium text-white/80 mb-6 text-center">
                {t.title}
                <span className="block text-xs text-slate-400 mt-1 font-sans font-normal uppercase tracking-widest">WebGL Simulation</span>
            </h3>

            {/* 3D Canvas Viewport */}
            <div className="relative w-full aspect-square max-h-[450px] mx-auto mb-8 bg-[#020617] rounded-full overflow-hidden shadow-inner border-[6px] border-slate-900 border-opacity-50">

                {/* Error Flash Overlay */}
                <motion.div
                    animate={{ opacity: errorState ? 0.3 : 0 }}
                    className="absolute inset-0 bg-red-500 z-10 mix-blend-screen pointer-events-none"
                    transition={{ duration: 0.1 }}
                />

                <Canvas camera={{ position: [0, 12, 0], fov: 50, up: [0, 0, -1] }}>
                    {/* Strict Top-Down Lighting */}
                    <ambientLight intensity={1} />

                    <DeePlates />
                    <MagneticFieldGrid intensity={magneticField} />

                    <Proton
                        electricField={electricField}
                        magneticField={magneticField}
                        isSuccess={isSuccess}
                        onError={handleCrash}
                    />

                    {/* Post Processing for Neon Glow */}
                    <EffectComposer>
                        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
                    </EffectComposer>
                </Canvas>

                {/* Ejection Port Indicator */}
                <div className={`absolute top-1/2 right-4 -translate-y-1/2 w-8 h-16 border-2 border-r-0 border-slate-700/50 rounded-l-xl z-10 transition-colors duration-500 ${isSuccess ? 'bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : ''}`} />
            </div>

            {/* Tactile Sliders Panel */}
            <div className="flex gap-6 px-4 pb-2 justify-center">
                <div className="flex flex-col items-center flex-1 max-w-[250px]">
                    <span className="text-xs uppercase tracking-widest text-slate-400 mb-4">{t.elec}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={electricField}
                        onChange={(e) => {
                            if (!hasCrashed) setElectricField(Number(e.target.value))
                        }}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                    />
                </div>

                <div className="flex flex-col items-center flex-1 max-w-[250px]">
                    <span className="text-xs uppercase tracking-widest text-slate-400 mb-4">{t.mag}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={magneticField}
                        onChange={(e) => {
                            if (!hasCrashed) setMagneticField(Number(e.target.value))
                        }}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-neon-violet"
                    />
                </div>
            </div>

            {/* Validation Feedback Status Card */}
            <div className="mt-6 px-4 h-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                        opacity: (isSuccess || errorState) ? 1 : 0,
                        scale: (isSuccess || errorState) ? 1 : 0.95
                    }}
                    className={`w-full py-3 rounded-xl text-center font-bold text-sm tracking-wide border 
                        ${isSuccess ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                            errorState ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'border-transparent'}`}
                >
                    {isSuccess ? t.success : (errorState ? t.fail : '')}
                </motion.div>
            </div>
        </div>
    )
}
