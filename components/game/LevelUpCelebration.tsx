'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface LevelUpCelebrationProps {
    show: boolean;
    levelId: number;
    stars: number;
    xpEarned: number;
    gemsEarned: number;
    subject: 'math' | 'pkn';
    onClose: () => void;
}

export default function LevelUpCelebration({
    show,
    levelId,
    stars,
    xpEarned,
    gemsEarned,
    subject,
    onClose,
}: LevelUpCelebrationProps) {
    const hasPlayedConfetti = useRef(false);

    const isMath = subject === 'math';
    const accentColor = isMath ? '#6366f1' : '#10b981';
    const accentLight = isMath ? '#818cf8' : '#34d399';

    useEffect(() => {
        if (show && !hasPlayedConfetti.current) {
            hasPlayedConfetti.current = true;
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10001 };

            function randomInRange(min: number, max: number) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    return;
                }
                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.1, 0.3) },
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.1, 0.3) },
                });
            }, 250);
        }

        if (!show) hasPlayedConfetti.current = false;
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[10000] flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ background: 'rgba(15, 13, 35, 0.9)', backdropFilter: 'blur(12px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />

                    {/* Card */}
                    <motion.div
                        initial={{ scale: 0.7, y: 40 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.7, y: 40 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative rounded-3xl p-8 sm:p-10 max-w-sm w-full text-center"
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(32px)',
                            border: `2px solid ${accentColor}30`,
                            boxShadow: `0 16px 64px ${accentColor}20`,
                        }}
                    >
                        {/* Level up text */}
                        <motion.p
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                            className="text-5xl mb-4"
                        >
                            🎉
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-extrabold text-white mb-1"
                        >
                            Level {levelId} Selesai!
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm text-white/40 mb-6"
                        >
                            {stars === 3 ? 'Sempurna! Kamu mendapatkan semua bintang!' : 'Kerja bagus! Terus tingkatkan!'}
                        </motion.p>

                        {/* Stars */}
                        <div className="flex justify-center gap-4 mb-6">
                            {[1, 2, 3].map((s) => (
                                <motion.span
                                    key={s}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.5 + s * 0.2, type: 'spring', stiffness: 300 }}
                                    className="text-5xl"
                                    style={{
                                        filter: s <= stars ? 'drop-shadow(0 0 16px rgba(245,158,11,0.7))' : 'none',
                                        opacity: s <= stars ? 1 : 0.15,
                                    }}
                                >
                                    {s <= stars ? '⭐' : '★'}
                                </motion.span>
                            ))}
                        </div>

                        {/* Rewards */}
                        <div className="flex justify-center gap-3 mb-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 }}
                                className="px-4 py-2 rounded-xl text-center"
                                style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}
                            >
                                <p className="text-lg font-extrabold" style={{ color: accentLight }}>+{xpEarned}</p>
                                <p className="text-[10px] text-white/30 font-bold">XP</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3 }}
                                className="px-4 py-2 rounded-xl text-center"
                                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}
                            >
                                <p className="text-lg font-extrabold text-purple-300">+{gemsEarned}</p>
                                <p className="text-[10px] text-white/30 font-bold">Gems</p>
                            </motion.div>
                        </div>

                        {/* Continue button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 }}
                            onClick={onClose}
                            className="w-full py-3.5 rounded-2xl font-bold text-white transition-all duration-200"
                            style={{
                                background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                                boxShadow: `0 4px 24px ${accentColor}33`,
                            }}
                        >
                            LANJUT
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
