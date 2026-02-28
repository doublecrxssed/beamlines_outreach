'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface RevealTextProps {
    children: ReactNode
    delay?: number
}

export function RevealText({ children, delay = 0 }: RevealTextProps) {
    return (
        <motion.div
            initial={{ opacity: 0.01 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // Custom spring-like easing 
                delay
            }}
            className="my-6 text-lg leading-relaxed text-slate-300"
        >
            {children}
        </motion.div>
    )
}
