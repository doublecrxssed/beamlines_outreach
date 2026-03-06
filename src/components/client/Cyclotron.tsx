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
            {/* Left Dee */}
            <mesh position={[-2.2, 0, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[5, 5, 0.5, 32, 1, false, Math.PI / 2, Math.PI]} />
                <meshPhysicalMaterial
                    color="#1e293b"
                    transparent
                    opacity={0.8}
                    roughness={0.2}
                    metalness={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Right Dee */}
            <mesh position={[2.2, 0, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[5, 5, 0.5, 32, 1, false, -Math.PI / 2, Math.PI]} />
                <meshPhysicalMaterial
                    color="#1e293b"
                    transparent
                    opacity={0.8}
                    roughness={0.2}
                    metalness={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Gap subtle visualizer */}
            <Box args={[4.4, 0.6, 10]} position={[0, 0, 0]}>
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} />
            </Box>
        </group>
    )
}

function MagneticFieldLines({ intensity }: { intensity: number }) {
    // Generate static grid of points for magnetic field vectors pointing "UP" (Y-axis)
    const lines = []
    const spacing = 1.5
    for (let x = -4; x <= 4; x += spacing) {
        for (let z = -4; z <= 4; z += spacing) {
            // Keep roughly within the circular radius of the Dees
            if (x * x + z * z <= 20 && Math.abs(x) > 1.5) {
                lines.push(
                    <Line
                        key={`bfield-${x}-${z}`}
                        points={[new THREE.Vector3(x, -2, z), new THREE.Vector3(x, 2, z)]}
                        color="#8b5cf6"
                        lineWidth={2}
                        transparent
                        opacity={0.1 + (intensity / 100) * 0.4}
                    />
                )
            }
        }
    }
    return <group>{lines}</group>
}

function Proton({ electricField, magneticField, isSuccess, onError }: { electricField: number, magneticField: number, isSuccess: boolean, onError: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const { camera } = useThree()

    // Physics State
    const pos = useRef(new THREE.Vector3(0.1, 0, 0)) // Start slightly offset to begin rotation
    const vel = useRef(new THREE.Vector3(0, 0, 0))
    const time = useRef(0)
    const radius = useRef(0.1)
    const speed = useRef(0.05)

    // Reset trail
    const [trail, setTrail] = useState<THREE.Vector3[]>([])

    // Physics constants mapped from 0-100 sliders
    const E_FORCE = 0.001 + (electricField / 100) * 0.015  // Acceleration across gap
    const B_FORCE = 0.01 + (magneticField / 100) * 0.1     // Turning force inside Dees

    useFrame((state, delta) => {
        if (!meshRef.current) return

        // If success is achieved, let particle fly off cleanly to the right
        if (isSuccess) {
            pos.current.x += 0.2
            meshRef.current.position.copy(pos.current)
            return
        }

        // If fields are zero, reset to center
        if (electricField === 0 && magneticField === 0) {
            pos.current.set(0.1, 0, 0)
            radius.current = 0.1
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
            setTrail(prev => [...prev.slice(-40), pos.current.clone()])
        }
    })

    return (
        <group>
            {/* The particle */}
            <Sphere ref={meshRef} args={[0.15, 16, 16]}>
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
            </Sphere>

            {/* Path Trail */}
            {trail.length > 2 && (
                <Line
                    points={trail}
                    color={electricField > magneticField + 20 ? "#f97316" : "#00ffff"}
                    lineWidth={1.5}
                    transparent
                    opacity={0.5}
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
                <span className="block text-xs text-slate-400 mt-1 font-sans font-normal uppercase tracking-widest">3D WebGL Simulation</span>
            </h3>

            {/* 3D Canvas Viewport */}
            <div className="relative w-full aspect-video min-h-[300px] mb-8 bg-[#020617] rounded-2xl overflow-hidden shadow-inner border border-white/5">

                {/* Error Flash Overlay */}
                <motion.div
                    animate={{ opacity: errorState ? 0.3 : 0 }}
                    className="absolute inset-0 bg-red-500 z-10 mix-blend-screen pointer-events-none"
                    transition={{ duration: 0.1 }}
                />

                <Canvas camera={{ position: [0, 8, 10], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 2.2}
                    />

                    <DeePlates />
                    <MagneticFieldLines intensity={magneticField} />

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
