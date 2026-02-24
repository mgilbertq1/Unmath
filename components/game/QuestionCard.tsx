'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface QuestionCardProps {
    children: ReactNode;
    questionKey: string;
    subject: 'math' | 'pkn';
}

export default function QuestionCard({ children, questionKey, subject }: QuestionCardProps) {
    const borderColor = subject === 'math' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)';
    const glowColor = subject === 'math'
        ? '0 0 60px rgba(99,102,241,0.08)'
        : '0 0 60px rgba(16,185,129,0.08)';

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={questionKey}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative rounded-3xl p-6 sm:p-8"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: `1px solid ${borderColor}`,
                    boxShadow: glowColor,
                }}
            >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)' }}
                />
                <div className="relative z-10">
                    {children}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
