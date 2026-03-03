'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface QuestionCardProps {
    children: ReactNode;
    questionKey: string;
    subject: 'math' | 'pkn';
}

export default function QuestionCard({ children, questionKey, subject }: QuestionCardProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={questionKey}
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.97 }}
                transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative"
                style={{
                    background: 'rgba(20,10,3,0.92)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(198,167,94,0.25)',
                    borderRadius: 24,
                    padding: '26px 24px 22px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,240,180,0.07)',
                    overflow: 'hidden',
                }}
            >
                {/* Top glow */}
                <div style={{
                    position: 'absolute', top: -40, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 200, height: 80,
                    background: 'radial-gradient(ellipse, rgba(198,167,94,0.1), transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Corner ornaments */}
                <span style={{
                    position: 'absolute', top: 12, left: 16,
                    fontSize: 16, color: 'rgba(198,167,94,0.18)', pointerEvents: 'none',
                }}>✦</span>
                <span style={{
                    position: 'absolute', bottom: 12, right: 16,
                    fontSize: 16, color: 'rgba(198,167,94,0.18)', pointerEvents: 'none',
                }}>✦</span>

                {/* Diagonal accent stripe */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: subject === 'math'
                        ? 'linear-gradient(135deg, rgba(164,117,81,0.07) 0%, transparent 55%)'
                        : 'linear-gradient(135deg, rgba(109,130,153,0.07) 0%, transparent 55%)',
                    borderRadius: 24, pointerEvents: 'none',
                }} />

                <div className="relative z-10">{children}</div>
            </motion.div>
        </AnimatePresence>
    );
}
