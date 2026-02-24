'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface GameHeaderProps {
    currentIndex: number;
    totalQuestions: number;
    xp: number;
    lives: number;
    maxLives: number;
    streak: number;
    subject: 'math' | 'pkn';
}

export default function GameHeader({
    currentIndex,
    totalQuestions,
    xp,
    lives,
    maxLives,
    streak,
    subject,
}: GameHeaderProps) {
    const router = useRouter();
    const progress = ((currentIndex + 1) / totalQuestions) * 100;
    const gradientColor = subject === 'math'
        ? 'linear-gradient(90deg, #6366f1, #818cf8)'
        : 'linear-gradient(90deg, #10b981, #34d399)';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
        >
            {/* Top bar: close, progress, counter */}
            <div className="flex items-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.push('/')}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    ✕
                </motion.button>

                {/* Progress bar */}
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                        className="h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{ background: gradientColor }}
                    />
                </div>

                {/* Question counter */}
                <span className="text-sm font-bold text-white/40 min-w-[3rem] text-right">
                    {currentIndex + 1}/{totalQuestions}
                </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between">
                {/* Lives */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: maxLives }).map((_, i) => (
                        <motion.span
                            key={i}
                            animate={i >= lives ? { scale: 0.7, opacity: 0.3 } : { scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                            className="text-lg"
                        >
                            {i < lives ? '❤️' : '🖤'}
                        </motion.span>
                    ))}
                </div>

                {/* Streak */}
                {streak > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-pill flex items-center gap-1 px-3 py-1"
                        style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.2)' }}
                    >
                        <span className="text-sm">🔥</span>
                        <span className="text-sm font-bold text-amber-400">{streak}</span>
                    </motion.div>
                )}

                {/* XP */}
                <motion.div
                    className="glass-pill flex items-center gap-1 px-3 py-1"
                    style={{
                        background: subject === 'math' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
                        border: `1px solid ${subject === 'math' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.2)'}`,
                    }}
                    key={xp}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="text-sm">⭐</span>
                    <span className={`text-sm font-bold ${subject === 'math' ? 'text-indigo-300' : 'text-emerald-300'}`}>
                        {xp.toLocaleString()} XP
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
}
