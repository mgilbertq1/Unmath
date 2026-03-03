'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface GameHeaderProps {
    currentIndex: number;
    totalQuestions: number;
    xp: number;
    lives: number;
    maxLives: number;
    streak: number;
    subject: 'math' | 'pkn';
    timeLeft: number;   // seconds remaining
    maxTime: number;    // total seconds for this question
}

const CIRC = 2 * Math.PI * 17.5; // r=17.5

export default function GameHeader({
    currentIndex,
    totalQuestions,
    xp,
    lives,
    maxLives,
    streak,
    subject,
    timeLeft,
    maxTime,
}: GameHeaderProps) {
    const router = useRouter();
    const progress = Math.min(((currentIndex) / totalQuestions) * 100, 100);
    const timePct = maxTime > 0 ? timeLeft / maxTime : 1;
    const timerColor = timeLeft <= 5 ? '#ef4444' : timeLeft <= 15 ? '#f97316' : '#7A9E7E';
    const TIMER_R = 14;
    const TIMER_CIRC = 2 * Math.PI * TIMER_R;

    return (
        <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 sm:gap-3"
        >
            {/* Back button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.back()}
                className="flex items-center justify-center shrink-0"
                style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'rgba(198,167,94,0.1)',
                    border: '1px solid rgba(198,167,94,0.25)',
                    color: '#C6A75E', fontSize: 16,
                }}
            >
                ←
            </motion.button>

            {/* Progress bar */}
            <div className="flex-1 relative" style={{ paddingTop: 18 }}>
                <span
                    className="absolute right-0 font-bold"
                    style={{ top: 0, fontSize: 10, color: 'rgba(198,167,94,0.55)', letterSpacing: '1px' }}
                >
                    {currentIndex + 1} / {totalQuestions}
                </span>
                <div
                    className="relative overflow-visible"
                    style={{
                        height: 10, borderRadius: 999,
                        background: 'rgba(198,167,94,0.1)',
                        border: '1px solid rgba(198,167,94,0.14)',
                    }}
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                            height: '100%', borderRadius: 999,
                            background: subject === 'math'
                                ? 'linear-gradient(90deg,#A47551,#C6A75E)'
                                : 'linear-gradient(90deg,#6D8299,#7A9E7E)',
                            boxShadow: '0 0 10px rgba(198,167,94,0.45)',
                            position: 'relative',
                        }}
                    >
                        {/* Glowing tip dot */}
                        <div style={{
                            position: 'absolute', right: -1, top: '50%',
                            transform: 'translateY(-50%)',
                            width: 14, height: 14, borderRadius: '50%',
                            background: '#F0DFA0',
                            boxShadow: '0 0 8px rgba(198,167,94,0.85)',
                        }} />
                    </motion.div>
                </div>
            </div>

            {/* ── Timer ring (Task 5) ── */}
            <div className="shrink-0 flex flex-col items-center" style={{ gap: 1 }}>
                <svg width="36" height="36">
                    <circle cx="18" cy="18" r={TIMER_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <motion.circle
                        cx="18" cy="18" r={TIMER_R}
                        fill="none"
                        stroke={timerColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={TIMER_CIRC}
                        animate={{ strokeDashoffset: TIMER_CIRC * (1 - timePct) }}
                        transition={{ duration: 0.3 }}
                        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', filter: timeLeft <= 5 ? 'drop-shadow(0 0 4px #ef4444)' : 'none' }}
                    />
                    <text x="18" y="22" textAnchor="middle" fontSize="10" fontWeight="800" fill={timerColor}>{timeLeft}</text>
                </svg>
            </div>

            {/* Hearts */}
            <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: maxLives }).map((_, i) => (
                    <motion.span
                        key={i}
                        animate={i >= lives
                            ? { scale: 0.65, opacity: 0.28 }
                            : { scale: [1, 1.1, 1], opacity: 1 }
                        }
                        transition={i < lives
                            ? { duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }
                            : { type: 'spring', stiffness: 400 }
                        }
                        style={{
                            fontSize: 18,
                            display: 'block',
                            filter: i < lives ? 'drop-shadow(0 0 5px rgba(255,80,80,0.5))' : 'grayscale(1)',
                        }}
                    >
                        {i < lives ? '❤️' : '🖤'}
                    </motion.span>
                ))}
            </div>

            {/* XP badge */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={xp}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-1 font-bold shrink-0"
                    style={{
                        fontSize: 11,
                        padding: '5px 11px', borderRadius: 999,
                        background: 'rgba(198,167,94,0.12)',
                        border: '1px solid rgba(198,167,94,0.3)',
                        color: '#C6A75E',
                    }}
                >
                    ⭐ {xp} XP
                </motion.div>
            </AnimatePresence>

            {/* Streak badge */}
            <AnimatePresence>
                {streak > 1 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex items-center gap-1 font-bold shrink-0"
                        style={{
                            fontSize: 11,
                            padding: '5px 11px', borderRadius: 999,
                            background: 'rgba(216,164,127,0.14)',
                            border: '1px solid rgba(216,164,127,0.3)',
                            color: '#D8A47F',
                        }}
                    >
                        🔥 {streak}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
